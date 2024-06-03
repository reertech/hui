defmodule Builder do
  # @themes [nil, "unua", "dua", "tria", "kvara", "kvina"]
  @states [nil, "active", "disabled", "readonly", "valid", "invalid"]

  @prefix_length 6

  def run do
    with [_ | _] = files <- System.argv() do
      Enum.each(files, fn file ->
        IO.puts("\n=== #{file} ===")
        build_file(file)
      end)
    else
      _ -> raise "Broken args"
    end
  end

  defp build_file(file_name) do
    with file_path <- Path.expand(file_name),
         {:ok, file} <- File.read(file_path),
         [_, ini] <- String.split(file, ~r"\<\!\-\-\s*theme\.ini"),
         params <- build_params(file_path, ini) do
      ini
      |> String.split(~r"\s*;\s*", trim: true)
      |> Enum.reduce([], &parse_line(&1, &2, params))
      |> Enum.reverse()
      |> build_style(params)
      |> build_theme(params)
    else
      _ -> raise "Broken file"
    end
  end

  defp parse_line(line, acc, params) do
    IO.puts("\nline:")
    IO.inspect(line)
    with [selector, tl] <- String.split(line, ~r"\s+=\s+", trim: true),
         sections <- String.split(tl, ~r"\s*,\s*", trim: true) do
      selector = clear_selector(selector)

      IO.puts("\nselector:")
      IO.inspect(selector)

      String.split(selector, ~r"\s*\|\s*", trim: true)
      |> Enum.reduce(acc, fn selector_part, acc ->
        IO.puts("\nselector_part:")
        IO.inspect(selector_part)

        prefix = build_prefix(selector, params)
        IO.puts("\nprefix line:")
        IO.inspect(prefix)

        sections =
          sections
          |> Enum.reverse()
          |> Enum.reduce([], fn section, acc ->
            case build_section(section) do
              {_, _} = section -> [section | acc]
              [_ | _] = sections -> sections ++ acc
              nil -> acc
            end
          end)

        [{selector_part, selector, prefix, sections} | acc]
      end)
    else
      _ -> acc
    end
  end

  defp build_style(sections, params) do
    lines =
      sections
      |> Enum.uniq_by(&elem(&1, 1))
      |> Enum.flat_map(fn {_, selector, prefix, sections} ->
        Enum.flat_map(sections, fn {section, rules} ->
          Enum.map(rules, fn {key, value} ->
            "  #{key}: var(#{prefix}-#{key}, #{value});"
          end)
          |> add_section_name(section)
        end)
        |> List.insert_at(0, build_selector(nil, nil, selector, params))
        |> List.insert_at(-1, "}")
      end)

    params.path.("styles")
    |> File.write!(lines |> Enum.join("\n"))

    sections
  end

  defp build_prefix(selector, params) do
    str = "#{params.name}_#{selector}"

    hash =
      :crypto.hash(:sha, str)
      |> Base.encode32(case: :lower)
      |> String.replace(~r"\d", "")
      |> String.slice(0, @prefix_length)

    "--hui-#{hash}"
  end

  defp build_theme(sections, params) do
    current_theme = parse_theme(params)
    defaults = current_theme["default"]["default"]

    if current_theme != %{} do
      IO.inspect(current_theme)
      IO.puts("===")
    end

    get_default = fn
      defaults, "&" -> defaults["default"]
      defaults, selector -> defaults[selector]
    end

    default_lines =
      Enum.flat_map(sections, fn {selector, _, prefix, sections} ->
        defaults = get_default.(defaults, selector)

        Enum.flat_map(sections, fn {section, rules} ->
          Enum.map(rules, fn {key, _} ->
            key = "#{key}-default"

            if val = defaults[key] do
              "  #{prefix}-#{key}: #{val};"
            else
              "/*  #{prefix}-#{key}: ; */"
            end
          end)
          |> add_section_name(section)
        end)
        |> List.insert_at(0, build_selector(nil, nil, selector, params))
        |> List.insert_at(-1, "}")
      end)

    section_lines =
      Enum.flat_map(params.themes, fn theme ->
        Enum.flat_map(@states, fn state ->
          Enum.flat_map(sections, fn {selector, _, prefix, sections} ->
            current = current_theme[theme || "default"][state || "default"][selector]
            defaults = get_default.(defaults, selector)

            Enum.flat_map(sections, fn {section, rules} ->
              Enum.map(rules, fn {key, _} ->
                # true -> "/*  #{key}: ; */"
                val = current[key]
                default = defaults["#{key}-default"]

                cond do
                  val && val =~ "var(#{prefix}-#{key}-default)" && !default -> nil
                  val -> "  #{prefix}-#{key}: #{val};"
                  default -> "  #{prefix}-#{key}: var(#{prefix}-#{key}-default);"
                  true -> nil
                end
              end)
              |> Enum.filter(&is_binary/1)
              |> case do
                [] -> []
                lines -> add_section_name(lines, section)
              end
            end)
            |> List.insert_at(0, build_selector(theme, state, selector, params))
            |> List.insert_at(-1, "}")
          end)
        end)
      end)

    theme = (section_lines ++ default_lines) |> Enum.join("\n")

    params.path.("themes") |> File.write!(theme)
  end

  defp add_section_name(lines, nil), do: lines

  defp add_section_name(lines, section) do
    ["  /* #{String.upcase(section)} */" | lines]
  end

  defp parse_theme(params) do
    parse_theme_name = fn selector, section ->
      with false <- selector == "default",
           [theme] <- ~r"(?<=\[data\-hui\-theme\~\=)\w+(?=\])" |> Regex.run(section) do
        theme
      else
        _ -> "default"
      end
    end

    parse_state_name = fn selector, section ->
      with false <- selector == "default",
           [state] <- ~r"(?<=\[data\-hui\-)\w+(?=\])" |> Regex.run(section),
           true <- state in @states do
        state
      else
        _ -> "default"
      end
    end

    parse_selector = fn section ->
      with [selector | _] <- ~r"^\[data\-hui\=(.|\n)+(?=\{)" |> Regex.run(section),
           theme <- parse_theme_name.(nil, section),
           state <- parse_state_name.(nil, section) do
        selector
        |> String.split(~r"\s*,\s*", trim: true)
        |> Enum.map(fn part ->
          ~r"\s*(((\[data\-hui\=)\w+(\]))|\{)\s*"
          |> Regex.replace(part, "")
          |> String.trim_leading("[data-hui-theme~=#{theme}]")
          |> String.trim_leading("[data-hui-#{state}]")
        end)
        |> Enum.join(",")
        |> clear_selector()
        |> case do
          "" -> if section =~ "-default:", do: "default", else: "&"
          selector -> selector
        end
        |> List.wrap()
      else
        _ -> :error
      end
    end

    with {:ok, css} <- params.path.("themes") |> File.read(),
         css <- ~r"(\/\*).+(\*\/)" |> Regex.replace(css, "\n"),
         sections <- css |> String.split(~r"\s*}\s*", trim: true) do
      Enum.reduce(sections, %{}, fn section, acc ->
        with [selector] <- parse_selector.(section),
             # prefix <- build_prefix(selector, params) <> "-",
             theme <- parse_theme_name.(selector, section),
             state <- parse_state_name.(selector, section) do
          String.split(section, ~r"\s*(\{|;)\s*", trim: true)
          |> Enum.reduce(acc, fn line, acc ->
            with false <- line =~ "data-hui",
                 [key, val] <-
                   String.split(line, ~r"\s*:\s*", trim: true)
                   |> Enum.map(&String.trim/1) do
              # key = key |> String.trim_trailing("-default")
              key =
                ~r"\-\-hui\-.{0,#{@prefix_length}}\-"
                |> Regex.replace(key, "")

              path = [
                Access.key(theme, %{}),
                Access.key(state, %{}),
                Access.key(selector, %{}),
                key
              ]

              acc |> put_in(path, val |> String.trim(";"))
            else
              _ -> acc
            end
          end)
        else
          _ -> acc
        end
      end)
    else
      _ -> %{}
    end
  end

  defp build_params(file_path, ini) do
    name = Path.basename(file_path, ".svelte")

    {section, base_path} =
      file_path
      |> Path.dirname()
      |> Path.split()
      |> List.pop_at(-1)

    file_path = fn type ->
      base_path
      |> Enum.drop(-1)
      |> Enum.concat([type, section, "#{name}.css"])
      |> Path.join()
    end

    themes =
      with [themes] <- ~r"(?<=themes\:)[\w\s,]+(?=\;)" |> Regex.run(ini) do
        themes = String.split(themes, ~r"(\s*,\s*|\s+)", trim: true)
        [nil | themes]
      else
        _ -> [nil]
      end

    %{
      name: name,
      themes: themes,
      path: file_path
    }
  end

  defp clear_selector(selector) do
    selector
    |> String.replace(~r"\s+", " ")
    |> String.replace(~r"\s*,\s*", ",\n")
    |> String.trim()
  end

  defp build_selector(theme, state, selector, params) do
    wrap = fn prefix ->
      "[data-hui=#{params.name}]#{prefix} #{selector} {"
      |> String.replace(~r"\]\s+\&", "]")
    end

    cond do
      selector |> String.contains?(["|", ","]) ->
        String.split(selector, ~r"\s*(\||,)\s*", trim: true)
        |> Enum.uniq()
        |> Enum.map(fn part ->
          build_selector(theme, state, part, params)
          |> String.trim_trailing(" {")
        end)
        |> Enum.join(",\n")
        |> Kernel.<>(" {")

      theme && state ->
        wrap.("[data-hui-theme~=#{theme}][data-hui-#{state}]")

      theme ->
        wrap.("[data-hui-theme~=#{theme}]")

      state ->
        wrap.("[data-hui-#{state}]")

      true ->
        wrap.("")
    end
  end

  defp build_section("layout-position" = name) do
    {name,
     [
       {"position", "static"},
       {"top", "auto"},
       {"right", "auto"},
       {"bottom", "auto"},
       {"left", "auto"},
       {"z-index", "auto"},
       {"float", "none"},
       {"clear", "none"},
       {"align-self", "auto"},
       {"order", "0"}
     ]}
  end

  defp build_section("display" = name) do
    {name,
     [
       {"display", "block"},
     ]}
  end

  defp build_section("layout-flex" = name) do
    {name,
     [
       {"flex-basis", "auto"},
       {"flex-direction", "row"},
       {"flex-grow", "0"},
       {"flex-shrink", "1"},
       {"flex-wrap", "nowrap"},
       {"gap", "0px"},
       {"align-content", "stretch"},
       {"justify-content", "flex-start"},
       {"align-items", "stretch"}
     ]}
  end

  defp build_section("layout-overflow" = name) do
    {name,
     [
       {"overflow-x", "visible"},
       {"overflow-y", "visible"}
     ]}
  end

  defp build_section("layout-margin" = name) do
    {name,
     [
       {"margin-top", "0px"},
       {"margin-right", "0px"},
       {"margin-bottom", "0px"},
       {"margin-left", "0px"}
     ]}
  end

  defp build_section("layout-padding" = name) do
    {name,
     [
       {"padding-top", "0px"},
       {"padding-right", "0px"},
       {"padding-bottom", "0px"},
       {"padding-left", "0px"}
     ]}
  end

  defp build_section("layout-sizing" = name) do
    {name,
     [
       {"box-sizing", "border-box"},
       {"height", "auto"},
       {"max-height", "none"},
       {"min-height", "auto"},
       {"width", "auto"},
       {"max-width", "none"},
       {"min-width", "auto"},
       # {"block-size", "unset"},
       # {"inline-size", "unset"},
       # {"max-block-size", "unset"},
       # {"max-inline-size", "unset"},
       # {"min-block-size", "unset"},
       # {"min-inline-size", "unset"}
       # {"resize", "none"},
     ]}
  end

  defp build_section("layout") do
    [
      "position",
      "sizing",
      "margin",
      "padding",
      "overflow",
      "flex"
    ]
    |> Enum.map(fn key ->
      build_section("layout-#{key}")
    end)
  end

  defp build_section("text" = name) do
    {name,
     [
       {"direction", "ltr"},
       {"font-family", "system-ui"},
       # {"font-feature-settings", "normal"},
       # {"font-kerning", "auto"},
       # {"font-optical-sizing", "auto"},
       {"font-size", "16px"},
       {"font-stretch", "100%"},
       {"font-style", "normal"},
       # {"font-variant-alternates", "normal"},
       # {"font-variant-caps", "normal"},
       # {"font-variant-east-asian", "normal"},
       # {"font-variant-ligatures", "normal"},
       # {"font-variant-numeric", "normal"},
       # {"font-variant-position", "normal"},
       # {"font-variation-settings", "normal"},
       {"font-weight", "400"},
       {"letter-spacing", "normal"},
       {"line-height", "normal"},
       # {"tab-size", "8"},
       {"text-align", "start"},
       {"text-align-last", "auto"},
       {"text-decoration-color", "#000"},
       {"text-decoration-line", "none"},
       {"text-decoration-style", "solid"},
       {"text-decoration-thickness", "auto"},
       {"text-indent", "0px"},
       {"text-overflow", "clip"},
       {"text-shadow", "none"},
       {"text-size-adjust", "auto"},
       {"text-transform", "none"},
       {"text-wrap", "wrap"},
       {"vertical-align", "baseline"},
       {"white-space-collapse", "collapse"},
       {"word-break", "normal"},
       {"word-spacing", "0px"}
     ]}
  end

  defp build_section("apperance" = name) do
    {name,
     [
       {"visibility", "visible"},
       {"color", "rgb(0, 0, 0)"},
       {"background-attachment", "scroll"},
       {"background-clip", "border-box"},
       {"background-color", "rgba(0, 0, 0, 0)"},
       {"background-image", "none"},
       {"background-origin", "padding-box"},
       {"background-position-x", "0%"},
       {"background-position-y", "0%"},
       {"background-repeat", "repeat"},
       {"background-size", "auto"},
       {"border-bottom-color", "rgb(0, 0, 0)"},
       {"border-bottom-style", "none"},
       {"border-bottom-width", "0px"},
       {"border-bottom-left-radius", "0px"},
       {"border-bottom-right-radius", "0px"},
       {"border-image-outset", "0"},
       {"border-image-repeat", "stretch"},
       {"border-image-slice", "100%"},
       {"border-image-source", "none"},
       {"border-image-width", "1"},
       {"border-left-color", "rgb(0, 0, 0)"},
       {"border-left-style", "none"},
       {"border-left-width", "0px"},
       {"border-right-color", "rgb(0, 0, 0)"},
       {"border-right-style", "none"},
       {"border-right-width", "0px"},
       {"border-top-color", "rgb(0, 0, 0)"},
       {"border-top-style", "none"},
       {"border-top-width", "0px"},
       {"border-top-left-radius", "0px"},
       {"border-top-right-radius", "0px"},
       {"box-shadow", "none"},
       {"cursor", "auto"},
       {"outline-color", "rgb(0, 0, 0)"},
       {"outline-offset", "0px"},
       {"outline-style", "none"},
       {"outline-width", "0px"},
       {"scrollbar-color", "#bbb #eee"},
       {"scrollbar-gutter", "auto"},
       {"scrollbar-width", "thin"}
     ]}
  end

  defp build_section("animation" = name) do
    {name,
     [
       {"animation-direction", "normal"},
       {"animation-duration", "0s"},
       {"animation-fill-mode", "none"},
       {"animation-iteration-count", "1"},
       {"animation-name", "none"},
       {"animation-play-state", "running"},
       {"animation-timing-function", "ease"},
       {"transition-behavior", "normal"},
       {"transition-delay", "0s"},
       {"transition-duration", "0s"},
       {"transition-property", "all"},
       {"transition-timing-function", "ease"}
     ]}
  end

  defp build_section("grid" = name) do
    {name,
     [
       {"grid-auto-columns", "auto"},
       {"grid-auto-flow", "row"},
       {"grid-auto-rows", "auto"},
       {"grid-column-end", "auto"},
       {"grid-column-start", "auto"},
       {"grid-row-end", "auto"},
       {"grid-row-start", "auto"},
       {"grid-template-areas", "none"},
       {"grid-template-columns", "none"},
       {"grid-template-rows", "none"},
       {"align-content", "normal"},
       {"justify-content", "normal"},
       {"align-items", "normal"},
       {"justify-items", "legacy"},
       {"column-gap", "0px"},
       {"row-gap", "0px"}
     ]}
  end

  defp build_section("content" = name) do
    {name,
     [
       {"content", "normal"},
       {"counter-increment", "none"},
       {"counter-reset", "none"},
       {"quotes", "auto"}
     ]}
  end

  defp build_section("other" = name) do
    {name,
     [
       {"color-scheme", "normal"},
       {"forced-color-adjust", "auto"},
       {"mask-image", "none"},
       {"math-depth", "0"},
       {"font-palette", "normal"},
       {"font-synthesis-small-caps", "auto"},
       {"font-synthesis-style", "auto"},
       {"font-synthesis-weight", "auto"},
       {"text-orientation", "mixed"},
       {"text-rendering", "auto"},
       {"text-spacing-trim", "normal"},
       {"writing-mode", "horizontal-tb"},
       {"zoom", "1"},
       {"accent-color", "auto"},
       {"alignment-baseline", "auto"},
       {"animation-composition", "replace"},
       {"animation-range-end", "normal"},
       {"animation-range-start", "normal"},
       {"animation-timeline", "auto"},
       {"app-region", "none"},
       {"appearance", "none"},
       {"aspect-ratio", "auto"},
       {"backdrop-filter", "none"},
       {"backface-visibility", "visible"},
       {"background-blend-mode", "normal"},
       {"baseline-shift", "0px"},
       {"baseline-source", "auto"},
       {"border-block-end-color", "rgb(0, 0, 0)"},
       {"border-block-end-style", "none"},
       {"border-block-end-width", "0px"},
       {"border-block-start-color", "rgb(0, 0, 0)"},
       {"border-block-start-style", "none"},
       {"border-block-start-width", "0px"},
       {"border-inline-end-color", "rgb(0, 0, 0)"},
       {"border-inline-end-style", "none"},
       {"border-inline-end-width", "0px"},
       {"border-inline-start-color", "rgb(0, 0, 0)"},
       {"border-inline-start-style", "none"},
       {"border-inline-start-width", "0px"},
       {"break-after", "auto"},
       {"break-before", "auto"},
       {"break-inside", "auto"},
       {"buffered-rendering", "auto"},
       {"caret-color", "rgb(0, 0, 0)"},
       {"clip-path", "none"},
       {"clip-rule", "nonzero"},
       {"color-interpolation", "srgb"},
       {"color-interpolation-filters", "linearrgb"},
       {"color-rendering", "auto"},
       {"column-count", "auto"},
       {"column-fill", "balance"},
       {"column-gap", "normal"},
       {"column-rule-color", "rgb(0, 0, 0)"},
       {"column-rule-style", "none"},
       {"column-rule-width", "0px"},
       {"column-span", "none"},
       {"column-width", "auto"},
       {"contain", "none"},
       {"contain-intrinsic-block-size", "none"},
       {"contain-intrinsic-height", "none"},
       {"contain-intrinsic-inline-size", "none"},
       {"contain-intrinsic-width", "none"},
       {"container-name", "none"},
       {"container-type", "normal"},
       {"content-visibility", "visible"},
       {"counter-set", "none"},
       {"cx", "0px"},
       {"cy", "0px"},
       {"d", "none"},
       {"dominant-baseline", "auto"},
       {"field-sizing", "fixed"},
       {"fill", "rgb(0, 0, 0)"},
       {"fill-opacity", "1"},
       {"fill-rule", "nonzero"},
       {"filter", "none"},
       {"flood-color", "rgb(0, 0, 0)"},
       {"flood-opacity", "1"},
       {"hyphenate-character", "auto"},
       {"hyphenate-limit-chars", "auto"},
       {"hyphens", "manual"},
       {"image-orientation", "from-image"},
       {"image-rendering", "auto"},
       {"initial-letter", "normal"},
       {"inset-block-end", "auto"},
       {"inset-block-start", "auto"},
       {"inset-inline-end", "auto"},
       {"inset-inline-start", "auto"},
       {"isolation", "auto"},
       {"lighting-color", "rgb(255, 255, 255)"},
       {"line-break", "auto"},
       {"list-style-image", "none"},
       {"list-style-position", "outside"},
       {"list-style-type", "disc"},
       {"margin-block-end", "0px"},
       {"margin-block-start", "0px"},
       {"margin-inline-end", "0px"},
       {"margin-inline-start", "0px"},
       {"marker-end", "none"},
       {"marker-mid", "none"},
       {"marker-start", "none"},
       {"mask-clip", "border-box"},
       {"mask-composite", "add"},
       {"mask-mode", "match-source"},
       {"mask-origin", "border-box"},
       {"mask-repeat", "repeat"},
       {"mask-size", "auto"},
       {"mask-type", "luminance"},
       {"math-shift", "normal"},
       {"math-style", "normal"},
       {"mix-blend-mode", "normal"},
       {"object-fit", "fill"},
       {"object-position", "50% 50%"},
       {"object-view-box", "none"},
       {"offset-anchor", "auto"},
       {"offset-distance", "0px"},
       {"offset-path", "none"},
       {"offset-position", "normal"},
       {"offset-rotate", "auto 0deg"},
       {"opacity", "1"},
       {"orphans", "2"},
       {"overflow-anchor", "auto"},
       {"overflow-clip-margin", "0px"},
       {"overflow-wrap", "normal"},
       {"overlay", "none"},
       {"overscroll-behavior-block", "auto"},
       {"overscroll-behavior-inline", "auto"},
       {"overscroll-behavior-x", "auto"},
       {"overscroll-behavior-y", "auto"},
       {"padding-block-end", "0px"},
       {"padding-block-start", "0px"},
       {"padding-inline-end", "0px"},
       {"padding-inline-start", "0px"},
       {"page", "auto"},
       {"paint-order", "normal"},
       {"perspective", "none"},
       {"perspective-origin", "0px 0px"},
       {"pointer-events", "auto"},
       {"r", "0px"},
       {"rotate", "none"},
       {"row-gap", "normal"},
       {"ruby-position", "over"},
       {"rx", "auto"},
       {"ry", "auto"},
       {"scale", "none"},
       {"scroll-behavior", "auto"},
       {"scroll-margin-block-end", "0px"},
       {"scroll-margin-block-start", "0px"},
       {"scroll-margin-bottom", "0px"},
       {"scroll-margin-inline-end", "0px"},
       {"scroll-margin-inline-start", "0px"},
       {"scroll-margin-left", "0px"},
       {"scroll-margin-right", "0px"},
       {"scroll-margin-top", "0px"},
       {"scroll-padding-block-end", "auto"},
       {"scroll-padding-block-start", "auto"},
       {"scroll-padding-bottom", "auto"},
       {"scroll-padding-inline-end", "auto"},
       {"scroll-padding-inline-start", "auto"},
       {"scroll-padding-left", "auto"},
       {"scroll-padding-right", "auto"},
       {"scroll-padding-top", "auto"},
       {"scroll-snap-align", "none"},
       {"scroll-snap-stop", "normal"},
       {"scroll-snap-type", "none"},
       {"scroll-timeline-axis", "block"},
       {"scroll-timeline-name", "none"},
       {"shape-image-threshold", "0"},
       {"shape-margin", "0px"},
       {"shape-outside", "none"},
       {"shape-rendering", "auto"},
       {"speak", "normal"},
       {"stop-color", "rgb(0, 0, 0)"},
       {"stop-opacity", "1"},
       {"stroke", "none"},
       {"stroke-dasharray", "none"},
       {"stroke-dashoffset", "0px"},
       {"stroke-linecap", "butt"},
       {"stroke-linejoin", "miter"},
       {"stroke-miterlimit", "4"},
       {"stroke-opacity", "1"},
       {"stroke-width", "1px"},
       {"text-anchor", "start"},
       {"text-combine-upright", "none"},
       {"text-decoration-skip-ink", "auto"},
       {"text-emphasis-color", "rgb(0, 0, 0)"},
       {"text-emphasis-position", "over"},
       {"text-emphasis-style", "none"},
       {"text-underline-offset", "auto"},
       {"text-underline-position", "auto"},
       {"timeline-scope", "none"},
       {"touch-action", "auto"},
       {"transform", "none"},
       {"transform-box", "view-box"},
       {"transform-origin", "0px 0px"},
       {"transform-style", "flat"},
       {"translate", "none"},
       {"unicode-bidi", "normal"},
       {"user-select", "auto"},
       {"vector-effect", "none"},
       {"view-timeline-axis", "block"},
       {"view-timeline-inset", "auto"},
       {"view-timeline-name", "none"},
       {"view-transition-name", "none"},
       {"widows", "2"},
       {"will-change", "auto"},
       {"x", "0px"},
       {"y", "0px"}
     ]}
  end

  defp build_section("common") do
    [
      build_section("layout"),
      [build_section("text")],
      [build_section("apperance")]
    ]
    |> Enum.concat()
  end

  defp build_section("all") do
    [
      build_section("display"),
      build_section("common"),
      [build_section("grid")],
      [build_section("animation")],
      [build_section("content")],
      [build_section("other")]
    ]
    |> Enum.concat()
  end

  defp build_section(rule) do
    {nil, [{rule, "initial"}]}
  end
end

Builder.run()

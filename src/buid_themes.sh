#! /usr/bin/env sh
grep -ral "theme.ini" components/**/*.svelte | xargs ls -1 | xargs elixir theme_builder.exs

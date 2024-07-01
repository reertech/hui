#! /usr/bin/env sh
grep -ral "theme.ini" components/**/*.svelte | xargs elixir theme_builder.exs

{ pkgs, ... }:

{
  # https://devenv.sh/basics/

  # https://devenv.sh/packages/
  packages = [ 
    pkgs.git
    pkgs.nodePackages.vercel
  ];

  # https://devenv.sh/scripts/

  # https://devenv.sh/languages/
  languages.javascript.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  processes.dev.exec = "npm run dev";

  # See full reference at https://devenv.sh/reference/options/
}

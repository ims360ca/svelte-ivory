# To use this file, run `nix-shell` in the same directory.
# This will drop you into a new shell with Node.js and pnpm available.

{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # buildInputs is a list of packages that will be available in the development shell.
  buildInputs = [
    pkgs.nodejs
    pkgs.pnpm
  ];

  # The shellHook is a string of shell commands that will be executed
  # after entering the nix-shell environment.
  shellHook = ''
    # Unset the annyoing NIX_CFLAGS_COMPILE environment variable
    unset NIX_CFLAGS_COMPILE

    # Welcome message
    echo "----------------------------------------------------"
    echo "      Nix development shell is ready!               "
    echo "----------------------------------------------------"
    echo "Available tools:"
    echo "- Node.js version: $(node --version)"
    echo "- npm version:     $(npm --version)"
    echo "- pnpm version:    $(pnpm --version)"
    echo ""

    # Optional: Check if node_modules exists and run `pnpm install` if it doesn't.
    # This is useful for ensuring dependencies are installed on first run.
    if [ ! -d "node_modules" ]; then
      echo "=> 'node_modules' directory not found. Running 'pnpm install' for you..."
      pnpm install
      echo "=> Dependencies installed."
    else
      echo "=> 'node_modules' directory already exists. Skipping 'pnpm install'."
    fi
    echo ""
  '';
}

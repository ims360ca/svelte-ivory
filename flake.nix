{
  description = "Pure Node.js + pnpm development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "node-dev-shell";

          packages = with pkgs; [
            nodejs_24
            pnpm
          ];

          shellHook = ''
            echo "--- Dev shell live ---" 
            echo "  Node  : $(node --version)"
            echo "  pnpm  : $(pnpm --version)"
          '';
        };
      }
    );
}
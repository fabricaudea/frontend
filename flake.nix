{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system} = rec {

			default = front;

      front = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
        ];
        shellHook = ''
          export SHELL="/run/current-system/sw/bin/bash"
        '';
      };
    };
  };
}

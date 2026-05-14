# Maintainer: Your Name <you@example.com>
pkgname=youtube-music
pkgver=4.0.0
pkgrel=1
pkgdesc="YouTube Music Desktop App - Atom Music 4.0 with glassmorphic UI and plugins"
arch=('x86_64')
url="https://github.com/IsSlashy/Atom-Music-4.0"
license=('MIT')
depends=('gtk3' 'libnotify' 'nss' 'libxss' 'libxtst' 'xdg-utils' 'at-spi2-core' 'util-linux-libs' 'alsa-lib')
makedepends=('nodejs>=22' 'pnpm>=10' 'git')
options=('!strip')
source=("git+${url}.git#tag=v${pkgver}")
sha256sums=('SKIP')

build() {
    cd "${srcdir}/Atom-Music-4.0"
    pnpm install
    # Build the source first
    pnpm build
    # Package with electron-builder for x64 only - 'dir' target creates linux-unpacked without packaging
    pnpm electron-builder --linux dir --x64 -p never
}

package() {
    cd "${srcdir}/Atom-Music-4.0"
    
    # Create directories
    install -dm755 "${pkgdir}/opt/${pkgname}"
    install -dm755 "${pkgdir}/usr/bin"
    install -dm755 "${pkgdir}/usr/share/applications"
    install -dm755 "${pkgdir}/usr/share/pixmaps"
    install -dm755 "${pkgdir}/usr/share/licenses/${pkgname}"
    
    # Copy the built app (from electron-builder output)
    cp -r pack/linux-unpacked/* "${pkgdir}/opt/${pkgname}/"
    
    # Create executable symlink
    ln -s "/opt/${pkgname}/youtube-music" "${pkgdir}/usr/bin/youtube-music"
    
    # Create desktop entry
    cat > "${pkgdir}/usr/share/applications/youtube-music.desktop" << EOF
[Desktop Entry]
Name=YouTube Music
Comment=YouTube Music Desktop App with glassmorphic UI
Exec=/opt/youtube-music/youtube-music %U
Terminal=false
Type=Application
Icon=youtube-music
Categories=AudioVideo;Music;
StartupWMClass=com.github.th_ch.youtube_music
MimeType=x-scheme-handler/ytmusic;
EOF
    
    # Copy icon
    if [ -f "assets/youtube-music.png" ]; then
        install -Dm644 "assets/youtube-music.png" "${pkgdir}/usr/share/pixmaps/youtube-music.png"
    fi
    
    # Install license
    install -Dm644 license "${pkgdir}/usr/share/licenses/${pkgname}/LICENSE"
    
    # Set permissions
    chmod 755 "${pkgdir}/opt/${pkgname}/youtube-music"
    chmod 4755 "${pkgdir}/opt/${pkgname}/chrome-sandbox"
}

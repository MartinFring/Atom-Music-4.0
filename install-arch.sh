#!/bin/bash
# Installation script for Atom Music 4.0 on Arch Linux

INSTALL_DIR="/opt/youtube-music"
DESKTOP_FILE="/usr/share/applications/youtube-music.desktop"
BIN_LINK="/usr/bin/youtube-music"

echo "Installing Atom Music 4.0..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo "Please run as root (use sudo)"
   exit 1
fi

# Remove old installation if exists
if [ -d "$INSTALL_DIR" ]; then
    echo "Removing old installation..."
    rm -rf "$INSTALL_DIR"
fi

# Copy application files
echo "Copying application files..."
if [ ! -d "dist/linux-unpacked" ]; then
    echo "Error: dist/linux-unpacked not found. Run 'pnpm dist:linux' first."
    exit 1
fi
cp -r "dist/linux-unpacked" "$INSTALL_DIR"

# Set permissions
chmod 755 "$INSTALL_DIR/youtube-music"
chmod 4755 "$INSTALL_DIR/chrome-sandbox"

# Create symlink
echo "Creating executable symlink..."
ln -sf "$INSTALL_DIR/youtube-music" "$BIN_LINK"

# Create desktop entry
echo "Creating desktop entry..."
cat > "$DESKTOP_FILE" << 'EOF'
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

# Copy icon if it exists
if [ -f "assets/youtube-music.png" ]; then
    echo "Installing icon..."
    cp "assets/youtube-music.png" "/usr/share/pixmaps/youtube-music.png"
fi

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database
fi

echo "Installation complete!"
echo "You can now run 'youtube-music' from terminal or find it in your application menu"
@echo off
cd ..

rm rmdir /s /q sig_beta3 2>nul
git clone https://github.com/Eriking21/sig_danny
cd sig_danny
npm update
npm run dev

@echo server closed

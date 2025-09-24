FROM debian:stable-slim

# Install XeLaTeX + popular packages + extra fonts
RUN apt-get update && apt-get install -y \
    texlive-xetex \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \    
    texlive-latex-recommended \
    nodejs \
    npm && \
    apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["npm", "start"]

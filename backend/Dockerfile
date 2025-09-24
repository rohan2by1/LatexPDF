FROM debian:stable-slim

# Install Node.js & XeLaTeX
RUN apt-get update && \
    apt-get install -y texlive-xetex texlive-fonts-recommended texlive-latex-extra \
    nodejs npm && \
    apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["npm", "start"]

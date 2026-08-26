FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all other source code
COPY . .

# Expose port
EXPOSE 3000

# ==========================================
# IMPORTANT: FOR PRODUCTION DEPLOYMENT
# ==========================================
# To production build, add RUN npm run build and
# replace the CMD line CMD ["npm", "run", "dev"] for CMD ["npm", "start"]:

# RUN npm run build
# CMD ["npm", "start"]
# ==========================================

# Run development server 
CMD ["npm", "run", "dev"]

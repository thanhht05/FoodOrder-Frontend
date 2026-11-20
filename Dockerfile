# ==========================================
# GIAI ĐOẠN 1: BIÊN DỊCH REACT VITE
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Các biến môi trường phục vụ build Vite
ARG VITE_BACKEND_URL=http://localhost:8081
ARG VITE_GOOGLE_CLIENT_ID=250171075174-lg64eg4a9vjgbjj9pnqh10phom6l1hiq.apps.googleusercontent.com

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Copy package.json để cache layer cài đặt thư viện
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ code frontend
COPY . .

# Build sản phẩm tĩnh ra thư mục dist
RUN npm run build

# ==========================================
# GIAI ĐOẠN 2: PHỤC VỤ BẰNG NGINX
# ==========================================
FROM nginx:alpine

# Copy kết quả build sang thư mục web chuẩn của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx riêng cho Frontend (xử lý React Router SPA)
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

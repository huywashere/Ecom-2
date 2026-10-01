# Electronics E-Commerce Platform (Web Bán Đồ Điện Tử)

Hệ thống Website Thương mại Điện tử chuyên ngành Điện tử, Thiết bị Công nghệ & Linh kiện cao cấp.

## Công nghệ sử dụng
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Axios, Zustand
- **Backend**: Java Spring Boot 3.3, Spring Security 6, JWT, Spring Data JPA, Hibernate, OpenAPI 3 (Swagger)
- **Database & Cache**: PostgreSQL 16 (Hỗ trợ JSONB specifications), Redis 7 (Caching, Session, Cart), H2 Database (Dev in-memory)

## Cấu trúc thư mục
- `client/`: Mã nguồn ứng dụng Next.js (Khách hàng & Trang quản trị Admin)
- `server/`: Mã nguồn REST API Spring Boot 3
- `docker-compose.yml`: Chạy PostgreSQL, Redis, pgAdmin cục bộ

## Khởi chạy nhanh

### 1. Backend (Spring Boot)
```bash
cd server
# Chạy với Maven Wrapper
./mvnw spring-boot:run
```
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 2. Frontend (Next.js)
```bash
cd client
npm install
npm run dev
```
Trang chủ: `http://localhost:3000`

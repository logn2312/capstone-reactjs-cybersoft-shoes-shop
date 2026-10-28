# Cybersoft Shoes Shop

Website bán giày, dự án Capstone ReactJS của Cybersoft Bootcamp.

**Demo:** _(cập nhật sau khi deploy Vercel)_

## Công nghệ

- React 19 + Vite
- React Router DOM v6
- Redux Toolkit (`createSlice`, `createAsyncThunk`) + React Redux
- Axios (interceptor tự gắn token)
- Lodash (sắp xếp giá ở trang Search)
- Bootstrap 5 + Bootstrap Icons
- API: [shop.cyberlearn.vn](https://shop.cyberlearn.vn/swagger)

## Chức năng

| Trang | Chức năng |
|---|---|
| Home | Carousel sản phẩm, danh mục, sản phẩm nổi bật |
| Men / Woman / Nike / Adidas / Kid / Sport | Sản phẩm theo danh mục, sắp xếp giá, Load more |
| Detail | Chọn size, số lượng, thêm vào giỏ, sản phẩm liên quan |
| Search | Tìm theo tên, lọc theo danh mục, sắp xếp giá bằng lodash |
| Carts | Chọn sản phẩm, đổi số lượng, xoá, đặt hàng *(cần đăng nhập)* |
| Login / Register | Validate form, đăng nhập email, đăng nhập Facebook |
| Profile | Cập nhật thông tin, lịch sử đơn hàng, sản phẩm yêu thích *(cần đăng nhập)* |

- Thêm vào giỏ → số lượng trên header tăng ngay; giỏ hàng lưu trong localStorage.
- Like / unlike sản phẩm (nút tim), đồng bộ với API.
- Responsive cho mobile.

## Chạy dự án

```bash
npm install
npm run dev     # https://localhost:5173
npm run build   # build ra thư mục dist
```

Dev server chạy **https** (plugin `@vitejs/plugin-basic-ssl`) vì Facebook Login yêu cầu https. Trình duyệt sẽ cảnh báo chứng chỉ tự ký, chọn "Proceed" để tiếp tục.

## Cấu trúc thư mục

```
src/
├── components/   # Header, Footer, ProductCard, Carousel, PrivateRoute...
├── pages/        # Home, Detail, Carts, Login, Register, Profile, Search, Category
├── redux/        # store + slices (product, user, cart)
├── services/     # axios instance, các hàm gọi API, Facebook SDK
└── utils/        # format giá, xử lý ảnh, danh mục
```

## Ghi chú

- API dùng chung cho cả lớp nên có nhiều sản phẩm test do học viên khác tạo (tên "string", ảnh lỗi...). Web chỉ hiện **18 sản phẩm gốc** của shop.
- Đăng nhập Facebook dùng Facebook App của Cybersoft. App này hiện bị Facebook khoá nên chưa đăng nhập được.

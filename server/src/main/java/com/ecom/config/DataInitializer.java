package com.ecom.config;

import com.ecom.constant.OrderStatus;
import com.ecom.constant.PaymentMethod;
import com.ecom.constant.PaymentStatus;
import com.ecom.constant.RoleEnum;
import com.ecom.entity.Brand;
import com.ecom.entity.Category;
import com.ecom.entity.Order;
import com.ecom.entity.OrderItem;
import com.ecom.entity.Product;
import com.ecom.entity.ProductVariant;
import com.ecom.entity.Role;
import com.ecom.entity.User;
import com.ecom.repository.BrandRepository;
import com.ecom.repository.CategoryRepository;
import com.ecom.repository.OrderItemRepository;
import com.ecom.repository.OrderRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.ProductVariantRepository;
import com.ecom.repository.RoleRepository;
import com.ecom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database đã có dữ liệu, bỏ qua bước khởi tạo seed data.");
            return;
        }

        log.info("Bắt đầu khởi tạo dữ liệu mẫu cho Website Đồ Điện Tử...");

        // 1. Roles
        Role roleCustomer = roleRepository.save(Role.builder().name(RoleEnum.ROLE_CUSTOMER).build());
        Role roleStaff = roleRepository.save(Role.builder().name(RoleEnum.ROLE_STAFF).build());
        Role roleAdmin = roleRepository.save(Role.builder().name(RoleEnum.ROLE_ADMIN).build());

        // 2. Users
        User admin = userRepository.save(User.builder()
                .email("admin@ecom.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Quản Trị Viên Hệ Thống")
                .phoneNumber("0988888888")
                .address("Tòa nhà Landmark 81, TP. Hồ Chí Minh")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .active(true)
                .roles(Set.of(roleAdmin, roleStaff, roleCustomer))
                .build());

        User customer = userRepository.save(User.builder()
                .email("customer@ecom.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Nguyễn Văn An")
                .phoneNumber("0912345678")
                .address("Số 123 Đường Cầu Giấy, Hà Nội")
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .active(true)
                .roles(Set.of(roleCustomer))
                .build());

        // 3. Categories
        Category catLaptop = categoryRepository.save(Category.builder()
                .name("Laptop & Máy tính xách tay")
                .slug("laptop")
                .icon("Laptop")
                .description("Laptop Gaming, MacBook, Ultrabook đồ họa chính hãng")
                .build());

        Category catPhone = categoryRepository.save(Category.builder()
                .name("Điện thoại & Tablet")
                .slug("dien-thoai")
                .icon("Smartphone")
                .description("iPhone, Samsung Galaxy, iPad cao cấp")
                .build());

        Category catMonitor = categoryRepository.save(Category.builder()
                .name("Màn hình máy tính")
                .slug("man-hinh")
                .icon("Monitor")
                .description("Màn hình OLED, 2K/4K, 144Hz - 240Hz Gaming & Đồ họa")
                .build());

        Category catAudio = categoryRepository.save(Category.builder()
                .name("Tai nghe & Âm thanh")
                .slug("tai-nghe")
                .icon("Headphones")
                .description("Tai nghe chống ồn, loa bluetooth, thiết bị studio")
                .build());

        Category catGear = categoryRepository.save(Category.builder()
                .name("Bàn phím & Chuột")
                .slug("ban-phim-chuot")
                .icon("Keyboard")
                .description("Bàn phím cơ custom, chuột gaming siêu nhẹ")
                .build());

        // 4. Brands
        Brand brandApple = brandRepository.save(Brand.builder()
                .name("Apple")
                .slug("apple")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg")
                .description("Tập đoàn công nghệ hàng đầu thế giới")
                .build());

        Brand brandAsus = brandRepository.save(Brand.builder()
                .name("ASUS ROG")
                .slug("asus")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg")
                .description("Thương hiệu laptop gaming và phần cứng hàng đầu")
                .build());

        Brand brandSony = brandRepository.save(Brand.builder()
                .name("Sony")
                .slug("sony")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg")
                .description("Đỉnh cao công nghệ âm thanh và hình ảnh")
                .build());

        Brand brandSamsung = brandRepository.save(Brand.builder()
                .name("Samsung")
                .slug("samsung")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg")
                .description("Dẫn đầu công nghệ màn hình và điện thoại thông minh")
                .build());

        Brand brandKeychron = brandRepository.save(Brand.builder()
                .name("Keychron")
                .slug("keychron")
                .logoUrl("https://keychron.com.vn/wp-content/uploads/2021/03/logo-keychron-official.png")
                .description("Thương hiệu bàn phím cơ không dây hàng đầu cho Mac và Windows")
                .build());

        // 5. Products with Electronics Specifications (JSONB specs)
        // Product 1: MacBook Pro 16 M3 Max
        String macbookSpecs = "{\"CPU\":\"Apple M3 Max (16-Core CPU, 40-Core GPU)\",\"RAM\":\"36GB / 48GB / 64GB Unified Memory\",\"Ổ cứng\":\"1TB / 2TB SSD NVMe\",\"Màn hình\":\"16.2 inch Liquid Retina XDR (3456x2234), 120Hz ProMotion, 1600 nits\",\"Pin\":\"100Wh, sạc nhanh 140W MagSafe 3\",\"Trọng lượng\":\"2.16 kg\",\"Cổng kết nối\":\"3x Thunderbolt 4 (USB-C), HDMI, SDXC card, Jack 3.5mm\"}";

        Product macbook = Product.builder()
                .name("MacBook Pro 16 inch M3 Max")
                .slug("macbook-pro-16-inch-m3-max")
                .shortDescription("Cỗ máy làm việc mạnh mẽ nhất với vi xử lý Apple M3 Max 16 nhân CPU, 40 nhân GPU cùng màn hình Liquid Retina XDR tuyệt đỉnh.")
                .detailDescription("<h3>Hiệu năng cấp độ máy trạm cho chuyên gia</h3><p>MacBook Pro 16 inch với chip M3 Max đem lại tốc độ xử lý dựng phim 8K, render 3D và chạy mô hình học máy cực nhanh. Thời lượng pin kỷ lục lên tới 22 giờ liên tục.</p>")
                .thumbnail("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800")
                .warrantyMonths(12)
                .featured(true)
                .published(true)
                .category(catLaptop)
                .brand(brandApple)
                .specifications(macbookSpecs)
                .build();
        macbook = productRepository.save(macbook);

        ProductVariant macVar1 = productVariantRepository.save(ProductVariant.builder()
                .product(macbook)
                .sku("MBP16-M3MAX-36-1TB-BLACK")
                .variantName("Đen Không Gian (Space Black) - 36GB RAM / 1TB SSD")
                .price(new BigDecimal("89990000"))
                .originalPrice(new BigDecimal("94990000"))
                .stockQuantity(15)
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800")
                .active(true)
                .build());

        ProductVariant macVar2 = productVariantRepository.save(ProductVariant.builder()
                .product(macbook)
                .sku("MBP16-M3MAX-48-2TB-SILVER")
                .variantName("Bạc Ánh Kim (Silver) - 48GB RAM / 2TB SSD")
                .price(new BigDecimal("109990000"))
                .originalPrice(new BigDecimal("115000000"))
                .stockQuantity(8)
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800")
                .active(true)
                .build());
        macbook.setVariants(List.of(macVar1, macVar2));

        // Product 2: ASUS ROG Strix SCAR 18
        String rogSpecs = "{\"CPU\":\"Intel Core i9-14900HX (24 nhân, 32 luồng, up to 5.8 GHz)\",\"GPU\":\"NVIDIA GeForce RTX 4090 16GB GDDR6 (TGP 175W)\",\"RAM\":\"32GB DDR5 5600MHz (Nâng cấp tối đa 64GB)\",\"Ổ cứng\":\"2TB SSD PCIe 4.0 NVMe M.2 (RAID 0)\",\"Màn hình\":\"18 inch 2.5K (2560x1600) ROG Nebula HDR Mini LED 240Hz/3ms\",\"Bàn phím\":\"Per-key RGB, Switch quang học cơ\",\"Tản nhiệt\":\"Công nghệ 3 quạt với kim loại lỏng Conductonaut Extreme\",\"Trọng lượng\":\"3.10 kg\"}";

        Product rogScar = Product.builder()
                .name("Laptop Gaming ASUS ROG Strix SCAR 18 (2024)")
                .slug("asus-rog-strix-scar-18-2024")
                .shortDescription("Quái vật gaming đỉnh cao với Intel Core i9-14900HX, RTX 4090 và màn hình 18 inch Mini LED 240Hz.")
                .detailDescription("<h3>Chinh phục mọi tựa game AAA ở thiết lập Ultra</h3><p>ROG Strix SCAR 18 trang bị cấu hình khủng nhất hiện nay, thiết kế hầm hố chuẩn game thủ cùng hệ thống đèn viền LED Aura Sync đẳng cấp.</p>")
                .thumbnail("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800")
                .warrantyMonths(24)
                .featured(true)
                .published(true)
                .category(catLaptop)
                .brand(brandAsus)
                .specifications(rogSpecs)
                .build();
        rogScar = productRepository.save(rogScar);

        ProductVariant rogVar1 = productVariantRepository.save(ProductVariant.builder()
                .product(rogScar)
                .sku("ROG-SCAR18-I9-4090")
                .variantName("Đen Stealth Black - i9-14900HX / RTX 4090 / 32GB / 2TB")
                .price(new BigDecimal("119990000"))
                .originalPrice(new BigDecimal("125000000"))
                .stockQuantity(10)
                .imageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800")
                .active(true)
                .build());
        rogScar.setVariants(List.of(rogVar1));

        // Product 3: iPhone 16 Pro Max
        String iphoneSpecs = "{\"Màn hình\":\"6.9 inch Super Retina XDR OLED, 120Hz ProMotion\",\"Chipset\":\"Apple A18 Pro 6 nhân\",\"Camera sau\":\"Chính 48MP + Góc siêu rộng 48MP + Tele 5x 12MP\",\"Camera trước\":\"12MP TrueDepth\",\"Khung viền\":\"Titanium Grade 5 siêu bền nhẹ\",\"Cổng kết nối\":\"USB-C 3.0 (tốc độ 10Gb/s)\",\"Pin\":\"Xem video liên tục lên đến 33 giờ\"}";

        Product iphone = Product.builder()
                .name("Điện thoại iPhone 16 Pro Max")
                .slug("iphone-16-pro-max")
                .shortDescription("Siêu phẩm điện thoại cao cấp nhất của Apple với màn hình 6.9 inch viền siêu mỏng, nút điều khiển camera mới và chip A18 Pro.")
                .detailDescription("<h3>Đỉnh cao công nghệ smartphone</h3><p>Khung viền Titan sa mạc mới mẻ, camera chụp đêm xuất sắc và nút Camera Control hỗ trợ chụp ảnh chuyên nghiệp chỉ với một thao tác vuốt chạm.</p>")
                .thumbnail("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800")
                .warrantyMonths(12)
                .featured(true)
                .published(true)
                .category(catPhone)
                .brand(brandApple)
                .specifications(iphoneSpecs)
                .build();
        iphone = productRepository.save(iphone);

        ProductVariant ipVar1 = productVariantRepository.save(ProductVariant.builder()
                .product(iphone)
                .sku("IP16PM-256GB-DESERT")
                .variantName("Titan Sa Mạc (Desert Titanium) - 256GB")
                .price(new BigDecimal("34990000"))
                .originalPrice(new BigDecimal("36990000"))
                .stockQuantity(25)
                .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800")
                .active(true)
                .build());

        ProductVariant ipVar2 = productVariantRepository.save(ProductVariant.builder()
                .product(iphone)
                .sku("IP16PM-512GB-BLACK")
                .variantName("Titan Đen (Black Titanium) - 512GB")
                .price(new BigDecimal("40990000"))
                .originalPrice(new BigDecimal("43990000"))
                .stockQuantity(18)
                .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800")
                .active(true)
                .build());
        iphone.setVariants(List.of(ipVar1, ipVar2));

        // Product 4: Samsung Galaxy S24 Ultra
        String s24Specs = "{\"Màn hình\":\"6.8 inch Dynamic AMOLED 2X 120Hz, độ sáng 2600 nits, kính Corning Gorilla Armor\",\"Chipset\":\"Snapdragon 8 Gen 3 for Galaxy (4nm)\",\"Camera sau\":\"Chính 200MP + Tele 50MP 5x + Tele 10MP 3x + Góc rộng 12MP\",\"Bút S-Pen\":\"Tích hợp sẵn trong thân máy\",\"Tính năng AI\":\"Galaxy AI (Dịch trực tiếp cuộc gọi, Khoanh tròn tìm kiếm)\",\"Pin\":\"5000 mAh, sạc nhanh 45W\"}";

        Product s24 = Product.builder()
                .name("Samsung Galaxy S24 Ultra 5G")
                .slug("samsung-galaxy-s24-ultra-5g")
                .shortDescription("Quyền năng Galaxy AI, camera zoom 100x 200MP, khung Titan và kính chống lóa cao cấp.")
                .detailDescription("<h3>Kỷ nguyên trí tuệ nhân tạo di động</h3><p>Trang bị trọn bộ tính năng Galaxy AI tiên tiến hỗ trợ công việc và sáng tạo nội dung tức thì.</p>")
                .thumbnail("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800")
                .warrantyMonths(12)
                .featured(true)
                .published(true)
                .category(catPhone)
                .brand(brandSamsung)
                .specifications(s24Specs)
                .build();
        s24 = productRepository.save(s24);

        ProductVariant s24Var1 = productVariantRepository.save(ProductVariant.builder()
                .product(s24)
                .sku("S24U-256GB-GREY")
                .variantName("Titan Xám (Titanium Gray) - 256GB / 12GB RAM")
                .price(new BigDecimal("29990000"))
                .originalPrice(new BigDecimal("33990000"))
                .stockQuantity(20)
                .imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800")
                .active(true)
                .build());
        s24.setVariants(List.of(s24Var1));

        // Product 5: Sony WH-1000XM5
        String sonySpecs = "{\"Loại tai nghe\":\"Over-ear chống ồn chủ động (ANC)\",\"Màng loa\":\"30mm màng carbon tổng hợp sợi siêu nhẹ\",\"Thời lượng pin\":\"30 giờ (bật ANC), 40 giờ (tắt ANC)\",\"Sạc nhanh\":\"3 phút sạc cho 3 giờ nghe\",\"Kết nối\":\"Bluetooth 5.2, cắm dây 3.5mm, đa điểm Multipoint 2 thiết bị\",\"Trọng lượng\":\"250 g\"}";

        Product sonyXm5 = Product.builder()
                .name("Tai nghe không dây chống ồn Sony WH-1000XM5")
                .slug("tai-nghe-chong-on-sony-wh-1000xm5")
                .shortDescription("Đỉnh cao chống ồn chủ động hàng đầu ngành với bộ xử lý kép V1 và QN1, chất âm Hi-Res Audio không dây.")
                .detailDescription("<h3>Thế giới yên tĩnh tuyệt đối</h3><p>Khả năng lọc tiếng ồn vượt trội của Sony WH-1000XM5 giúp bạn hoàn toàn đắm chìm trong âm nhạc chất lượng phòng thu mọi lúc mọi nơi.</p>")
                .thumbnail("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800")
                .warrantyMonths(12)
                .featured(true)
                .published(true)
                .category(catAudio)
                .brand(brandSony)
                .specifications(sonySpecs)
                .build();
        sonyXm5 = productRepository.save(sonyXm5);

        ProductVariant sonyVar1 = productVariantRepository.save(ProductVariant.builder()
                .product(sonyXm5)
                .sku("SONY-XM5-BLACK")
                .variantName("Màu Đen Sang Trọng (Midnight Black)")
                .price(new BigDecimal("7990000"))
                .originalPrice(new BigDecimal("8990000"))
                .stockQuantity(30)
                .imageUrl("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800")
                .active(true)
                .build());

        ProductVariant sonyVar2 = productVariantRepository.save(ProductVariant.builder()
                .product(sonyXm5)
                .sku("SONY-XM5-SILVER")
                .variantName("Màu Bạc Bạch Kim (Platinum Silver)")
                .price(new BigDecimal("7990000"))
                .originalPrice(new BigDecimal("8990000"))
                .stockQuantity(22)
                .imageUrl("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800")
                .active(true)
                .build());
        sonyXm5.setVariants(List.of(sonyVar1, sonyVar2));

        // Product 6: Keychron Q1 Pro
        String keychronSpecs = "{\"Layout\":\"75% (81 phím) kèm núm xoay Knob đa năng\",\"Vỏ case\":\"Nhôm CNC nguyên khối anodized cao cấp\",\"Switch\":\"Keychron K Pro Red / Banana (Hotswap 5-pin)\",\"Keycaps\":\"KSA Profile PBT Double-shot chống mòn bóng\",\"Kết nối\":\"Bluetooth 5.1 (3 thiết bị) & Type-C có dây 1000Hz\",\"Tương thích\":\"Hoàn toàn tương thích macOS và Windows (kèm nút thay thế)\",\"Dung lượng pin\":\"4000 mAh (dùng đến 300 giờ không LED)\"}";

        Product keychron = Product.builder()
                .name("Bàn phím cơ không dây nhôm nguyên khối Keychron Q1 Pro")
                .slug("ban-phim-co-keychron-q1-pro")
                .shortDescription("Bàn phím cơ custom vỏ nhôm nguyên khối, kết nối không dây Bluetooth 5.1 và núm xoay rotary knob sang trọng.")
                .detailDescription("<h3>Trải nghiệm gõ phím hoàn hảo</h3><p>Keychron Q1 Pro sở hữu thiết kế Double-Gasket êm ái, âm gõ đầm chắc và phần mềm QMK/VIA tùy biến từng nút bấm.</p>")
                .thumbnail("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800")
                .warrantyMonths(12)
                .featured(false)
                .published(true)
                .category(catGear)
                .brand(brandKeychron)
                .specifications(keychronSpecs)
                .build();
        keychron = productRepository.save(keychron);

        ProductVariant keyVar1 = productVariantRepository.save(ProductVariant.builder()
                .product(keychron)
                .sku("KC-Q1PRO-RED-CARBON")
                .variantName("Carbon Black - Red Switch (Linear nhẹ êm)")
                .price(new BigDecimal("4690000"))
                .originalPrice(new BigDecimal("4990000"))
                .stockQuantity(16)
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800")
                .active(true)
                .build());
        keychron.setVariants(List.of(keyVar1));

        // 6. Sample Initial Order
        Order sampleOrder = Order.builder()
                .orderCode("ORD-20260906-1024")
                .user(customer)
                .recipientName("Nguyễn Văn An")
                .recipientPhone("0912345678")
                .shippingAddress("Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội")
                .notes("Giao giờ hành chính, gọi trước khi giao 15 phút")
                .totalAmount(new BigDecimal("7990000"))
                .shippingFee(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(new BigDecimal("7990000"))
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.CONFIRMED)
                .build();

        sampleOrder = orderRepository.save(sampleOrder);

        OrderItem sampleItem = OrderItem.builder()
                .order(sampleOrder)
                .variant(sonyVar1)
                .productName("Tai nghe không dây chống ồn Sony WH-1000XM5")
                .variantName("Màu Đen Sang Trọng (Midnight Black)")
                .sku("SONY-XM5-BLACK")
                .imageUrl("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800")
                .price(new BigDecimal("7990000"))
                .quantity(1)
                .subtotal(new BigDecimal("7990000"))
                .build();

        orderItemRepository.save(sampleItem);
        sampleOrder.setItems(List.of(sampleItem));

        log.info("Khởi tạo seed data thành công! Đã tạo Admin: admin@ecom.com, Customer: customer@ecom.com");
    }
}

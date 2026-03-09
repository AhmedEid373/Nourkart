import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nourkart.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  // Create admin
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // Default settings
  const defaultSettings = [
    { key: "signup_enabled", value: "true" },
    { key: "logo_text", value: "Nourkart" },
    { key: "footer_text", value: "Transform your walls with unique decor pieces that reflect your personality and style." },
    { key: "footer_email", value: "info@nourkart.com" },
    { key: "footer_phone", value: "+20 100 000 0000" },
    { key: "footer_address", value: "Cairo, Egypt" },
    { key: "site_tagline_en", value: "Your home decor destination" },
    { key: "site_tagline_ar", value: "وجهتك لديكور المنزل" },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Default settings initialized");

  // Sample categories
  const categories = [
    { nameEn: "Abstract Art", nameAr: "فن تجريدي", slug: "abstract-art" },
    { nameEn: "Nature & Landscapes", nameAr: "الطبيعة والمناظر الطبيعية", slug: "nature-landscapes" },
    { nameEn: "Typography", nameAr: "الخط والطباعة", slug: "typography" },
    { nameEn: "Islamic Art", nameAr: "الفن الإسلامي", slug: "islamic-art" },
    { nameEn: "Modern Art", nameAr: "الفن الحديث", slug: "modern-art" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Sample categories created");

  // Sample products
  const cats = await prisma.category.findMany();
  const catMap: Record<string, string> = {};
  cats.forEach((c) => (catMap[c.slug] = c.id));

  const products = [
    {
      nameEn: "Golden Abstract Canvas",
      nameAr: "لوحة تجريدية ذهبية",
      descriptionEn: "A stunning golden abstract canvas that adds luxury to any room",
      descriptionAr: "لوحة تجريدية ذهبية رائعة تضيف فخامة لأي غرفة",
      price: 850,
      discountPrice: 650,
      stock: 15,
      images: JSON.stringify(["https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&h=600&fit=crop"]),
      categoryId: catMap["abstract-art"],
      featured: true,
      active: true,
    },
    {
      nameEn: "Forest Landscape Print",
      nameAr: "لوحة غابة طبيعية",
      descriptionEn: "Beautiful forest landscape perfect for living rooms and offices",
      descriptionAr: "لوحة غابة جميلة مثالية لغرف المعيشة والمكاتب",
      price: 550,
      stock: 20,
      images: JSON.stringify(["https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=600&fit=crop"]),
      categoryId: catMap["nature-landscapes"],
      featured: true,
      active: true,
    },
    {
      nameEn: "Motivational Quote Frame",
      nameAr: "إطار اقتباس تحفيزي",
      descriptionEn: "Elegant motivational quote in a premium wooden frame",
      descriptionAr: "اقتباس تحفيزي أنيق في إطار خشبي فاخر",
      price: 320,
      stock: 30,
      images: JSON.stringify(["https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&h=600&fit=crop"]),
      categoryId: catMap["typography"],
      active: true,
    },
    {
      nameEn: "Islamic Geometric Pattern",
      nameAr: "نمط هندسي إسلامي",
      descriptionEn: "Intricate Islamic geometric pattern, laser-cut from premium wood",
      descriptionAr: "نمط هندسي إسلامي دقيق، مقطوع بالليزر من خشب فاخر",
      price: 1200,
      discountPrice: 950,
      stock: 8,
      images: JSON.stringify(["https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=600&h=600&fit=crop"]),
      categoryId: catMap["islamic-art"],
      featured: true,
      active: true,
    },
    {
      nameEn: "Minimalist Lines Canvas",
      nameAr: "لوحة خطوط مينيمالست",
      descriptionEn: "Simple yet elegant minimalist line art for modern interiors",
      descriptionAr: "فن خطوط بسيط وأنيق للديكور الحديث",
      price: 420,
      stock: 25,
      images: JSON.stringify(["https://images.unsplash.com/photo-1578926078693-9e30c1a8d4e9?w=600&h=600&fit=crop"]),
      categoryId: catMap["modern-art"],
      active: true,
    },
    {
      nameEn: "Sunset Ocean Canvas",
      nameAr: "لوحة غروب المحيط",
      descriptionEn: "Breathtaking sunset over the ocean, vibrant colors on premium canvas",
      descriptionAr: "غروب ساحر فوق المحيط، ألوان نابضة بالحياة على قماش فاخر",
      price: 680,
      discountPrice: 520,
      stock: 12,
      images: JSON.stringify(["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop"]),
      categoryId: catMap["nature-landscapes"],
      active: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product }).catch(() => {});
  }
  console.log("✅ Sample products created");

  // Default social media
  const socials = [
    { name: "facebook", url: "https://facebook.com/nourkart", order: 1 },
    { name: "instagram", url: "https://instagram.com/nourkart", order: 2 },
    { name: "whatsapp", url: "https://wa.me/201000000000", order: 3 },
  ];

  for (const social of socials) {
    const existing = await prisma.socialMedia.findFirst({ where: { name: social.name } });
    if (!existing) {
      await prisma.socialMedia.create({ data: social });
    }
  }
  console.log("✅ Default social media links created");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\nAdmin Login:\n  Email: ${adminEmail}\n  Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

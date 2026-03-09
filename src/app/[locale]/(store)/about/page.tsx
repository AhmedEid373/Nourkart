import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const isRTL = locale === "ar";

  const content = await prisma.pageContent
    .findUnique({ where: { page: "about" } })
    .catch(() => null);

  const title = content
    ? isRTL
      ? content.titleAr
      : content.titleEn
    : t("about.title");
  const body = content
    ? isRTL
      ? content.contentAr
      : content.contentEn
    : t("about.subtitle");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div
        className="rounded-3xl p-8 md:p-12 mb-12 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #0FADAD 0%, #07c4c4 100%)",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">{body}</p>
      </div>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isRTL ? "قصتنا" : "Our Story"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {isRTL
              ? "نوركارت هو متجر إلكتروني متخصص في ديكورات الحوائط الفاخرة. نؤمن بأن كل جدار يحكي قصة، ومهمتنا مساعدتك في سرد قصتك بأجمل الألوان والأشكال."
              : "Nourkart is an e-commerce store specialized in premium wall decor. We believe every wall tells a story, and our mission is to help you tell yours with the most beautiful colors and shapes."}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {isRTL
              ? "نقدم مجموعة واسعة من اللوحات الفنية، الديكورات الخشبية، الإطارات المعدنية وغيرها من الأعمال الفنية التي تضيف لمسة من الجمال والأناقة لمنزلك."
              : "We offer a wide range of art prints, wooden decorations, metal frames, and other artworks that add a touch of beauty and elegance to your home."}
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
            alt="About Nourkart"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {isRTL ? "قيمنا" : "Our Values"}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🎨",
              titleEn: "Quality Art",
              titleAr: "جودة فنية",
              descEn:
                "Every piece is carefully selected for its quality and artistic value",
              descAr: "كل قطعة مختارة بعناية لجودتها وقيمتها الفنية",
            },
            {
              icon: "🚚",
              titleEn: "Fast Delivery",
              titleAr: "توصيل سريع",
              descEn: "Quick and safe delivery to your doorstep across Egypt",
              descAr: "توصيل سريع وآمن إلى باب منزلك في جميع أنحاء مصر",
            },
            {
              icon: "💯",
              titleEn: "Satisfaction Guaranteed",
              titleAr: "ضمان الرضا",
              descEn: "We stand behind every product with a satisfaction guarantee",
              descAr: "نضمن رضاك عن كل منتج نقدمه",
            },
          ].map((value) => (
            <div
              key={value.titleEn}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 card-hover"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {isRTL ? value.titleAr : value.titleEn}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isRTL ? value.descAr : value.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

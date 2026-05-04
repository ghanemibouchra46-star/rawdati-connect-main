import { BookOpen, Utensils, MessageCircle, Brain, Heart, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Article {
  id: string;
  title_ar: string;
  titleFr: string;
  titleEn: string;
  description_ar: string;
  descriptionFr: string;
  descriptionEn: string;
  content_ar: string;
  contentFr: string;
  contentEn: string;
  icon: LucideIcon;
  category_ar: string;
  categoryFr: string;
  categoryEn: string;
}

export const parentingArticles: Article[] = [
  {
    id: 'stubborn-child',
    title_ar: 'كيف تتعامل مع الطفل العنيد؟',
    titleFr: 'Comment gérer un enfant têtu ?',
    titleEn: 'How to handle a stubborn child?',
    description_ar: 'نصائح وحلول تربوية للتعامل مع نوبات الغضب والعناد عند الأطفال بطريقة إيجابية.',
    descriptionFr: 'Conseils et solutions éducatives pour gérer les crises de colère et l\'entêtement de manière positive.',
    descriptionEn: 'Educational tips and solutions for dealing with tantrums and stubbornness in children positively.',
    category_ar: 'تربية',
    categoryFr: 'Éducation',
    categoryEn: 'Parenting',
    icon: Brain,
    content_ar: `
      العناد في مرحلة الطفولة هو جزء من تطور شخصية الطفل ومحاولته للاستقلال. إليك بعض النصائح:
      1. تجنب الصدام المباشر: لا تدخل في صراع قوى مع الطفل.
      2. التخيير بدل الأوامر: بدلاً من قوله "البس ملابسك"، قل "هل تريد القميص الأحمر أم الأزرق؟".
      3. كن قدوة في الهدوء: الطفل يقلد ردود فعلك، فكن دائماً هادئاً.
      4. المدح والتحفيز: ركز على السلوكيات الجيدة وشجعه عليها.
      5. الاستماع للطفل: أحياناً يكون العناد وسيلة للتعبير عن حاجة غير ملباة.
    `,
    contentFr: `
      L'entêtement chez l'enfant fait partie du développement de sa personnalité et de sa recherche d'indépendance. Voici quelques conseils :
      1. Évitez la confrontation directe : N'entrez pas dans un rapport de force.
      2. Offrez des choix plutôt que des ordres : Au lieu de dire "Habille-toi", dites "Veux-tu le t-shirt rouge ou le bleu ?".
      3. Soyez un modèle de calme : L'enfant imite vos réactions, restez calme.
      4. Éloges et motivation : Concentrez-vous sur les bons comportements.
      5. Écoutez l'enfant : Parfois, l'entêtement exprime un besoin non satisfait.
    `,
    contentEn: `
      Stubbornness in childhood is part of personality development and seeking independence. Here are some tips:
      1. Avoid direct confrontation: Do not enter into a power struggle.
      2. Offer choices instead of commands: Instead of saying "Get dressed," say "Do you want the red or blue shirt?".
      3. Be a model of calmness: Children imitate your reactions, so stay calm.
      4. Praise and motivation: Focus on good behaviors and encourage them.
      5. Listen to the child: Sometimes stubbornness is a way of expressing an unmet need.
    `
  },
  {
    id: 'child-nutrition',
    title_ar: 'تغذية الطفل السليمة',
    titleFr: 'Nutrition saine pour l\'enfant',
    titleEn: 'Healthy Child Nutrition',
    description_ar: 'دليل شامل حول أهم الأطعمة والوجبات الصحية التي يحتاجها طفلك لنمو سليم.',
    descriptionFr: 'Guide complet sur les aliments les plus importants pour une croissance saine.',
    descriptionEn: 'Comprehensive guide to the most important healthy foods and meals your child needs for proper growth.',
    category_ar: 'صحة',
    categoryFr: 'Santé',
    categoryEn: 'Health',
    icon: Utensils,
    content_ar: `
      التغذية السليمة هي حجر الزاوية في نمو الطفل جسدياً وذهنياً:
      1. وجبة الإفطار: هي الأهم لتزويد الطفل بالطاقة اللازمة لبدء يومه.
      2. التنوع الغذائي: احرص على وجود جميع العناصر (بروتينات، ألياف، فيتامينات).
      3. التقليل من السكريات: استبدل الحلويات المصنعة بالفواكه الطبيعية.
      4. شرب الماء: شجع الطفل على شرب الماء بانتظام بدلاً من العصائر المحلاة.
      5. إشراك الطفل: اترك طفلك يشاركك في تحضير الوجبات لزيادة رغبته في الأكل الصحي.
    `,
    contentFr: `
      Une alimentation saine est la pierre angulaire du développement physique et mental :
      1. Petit-déjeuner : C'est le repas le plus important pour donner de l'énergie.
      2. Diversité alimentaire : Veillez à inclure tous les éléments (protéines, fibres, vitamines).
      3. Réduisez le sucre : Remplacez les sucreries par des fruits naturels.
      4. Buvez de l'eau : Encouragez l'eau plutôt que les jus sucrés.
      5. Impliquez l'enfant : Laissez votre enfant participer à la préparation des repas.
    `,
    contentEn: `
      Proper nutrition is the cornerstone of a child's physical and mental development:
      1. Breakfast: The most important meal to provide energy to start the day.
      2. Nutritional diversity: Ensure all elements (proteins, fiber, vitamins) are present.
      3. Reduce sugars: Replace processed sweets with natural fruits.
      4. Drink water: Encourage regular water intake instead of sweetened juices.
      5. Involve the child: Let your child participate in meal prep to increase interest in healthy eating.
    `
  },
  {
    id: 'speech-development',
    title_ar: 'تعليم الطفل الكلام',
    titleFr: 'Apprendre à parler à l\'enfant',
    titleEn: 'Teaching the Child to Speak',
    description_ar: 'خطوات عملية لتحفيز طفلك على الكلام وتطوير مهاراته اللغوية في المنزل.',
    descriptionFr: 'Étapes pratiques pour stimuler la parole et développer les compétences linguistiques.',
    descriptionEn: 'Practical steps to stimulate your child to speak and develop language skills at home.',
    category_ar: 'تطوير',
    categoryFr: 'Développement',
    categoryEn: 'Development',
    icon: MessageCircle,
    content_ar: `
      تطور اللغة يختلف من طفل لآخر، ولكن يمكنك تقديم المساعدة من خلال:
      1. التحدث المستمر مع الطفل: صف له ما تفعله خلال اليوم ببساطة.
      2. القراءة اليومية: القصص المصورة تزيد من حصيلة الطفل اللغوية.
      3. تكرار الكلمات: كرر أسماء الأشياء بوضوح وبطء.
      4. تقليل وقت الشاشات: التفاعل البشري هو الأهم لتعلم اللغة.
      5. الصبر وعدم الضغط: لا تجبر الطفل على التحدث، بل شجعه بكل حب.
    `,
    contentFr: `
      Le développement du langage varie d'un enfant à l'autre, mais vous pouvez l'aider :
      1. Parlez constamment : Décrivez simplement ce que vous faites pendant la journée.
      2. Lecture quotidienne : Les histoires illustrées enrichissent le vocabulaire.
      3. Répétez les mots : Nommez les objets clairement et lentement.
      4. Réduisez le temps d'écran : L'interaction humaine est primordiale.
      5. Patience et pas de pression : N'obligez pas l'enfant à parler, encouragez-le.
    `,
    contentEn: `
      Language development varies between children, but you can provide help through:
      1. Constant talking: Simply describe what you are doing during the day.
      2. Daily reading: Picture stories increase vocabulary.
      3. Word repetition: Repeat names of objects clearly and slowly.
      4. Reduce screen time: Human interaction is most important for language learning.
      5. Patience and no pressure: Don't force the child to speak; encourage them with love.
    `
  },
  {
    id: 'emotional-intelligence',
    title_ar: 'تطوير الذكاء العاطفي',
    titleFr: 'Développer l\'intelligence émotionnelle',
    titleEn: 'Developing Emotional Intelligence',
    description_ar: 'كيف تعلم طفلك التعرف على مشاعره والتعبير عنها بشكل صحي.',
    descriptionFr: 'Comment apprendre à votre enfant à reconnaître ses émotions et à les exprimer sainement.',
    descriptionEn: 'How to teach your child to recognize and express their feelings in a healthy way.',
    category_ar: 'تربية',
    categoryFr: 'Éducation',
    categoryEn: 'Parenting',
    icon: Heart,
    content_ar: `
      الذكاء العاطفي يساعد الطفل على النجاح في علاقاته المستقبيلة:
      1. تسمية المشاعر: ساعد طفلك على تسمية ما يشعر به (حزين، غاضب، سعيد).
      2. التعاطف: أظهر تعاطفك مع مشاعره ولا تستصغرها.
      3. حل المشكلات: علم الطفل كيف يهدأ قبل اتخاذ أي قرار.
      4. التحفيز الذاتي: شجعه على المحاولة مرة أخرى عند الفشل.
    `,
    contentFr: `
      L'intelligence émotionnelle aide l'enfant à réussir ses relations futures :
      1. Nommer les émotions : Aidez-le à identifier ses sentiments (triste, en colère, joyeux).
      2. Empathie : Montrez de l'empathie envers ses sentiments.
      3. Résolution de problèmes : Apprenez-lui à se calmer avant de décider.
      4. Auto-motivation : Encouragez-le à essayer de nouveau en cas d'échec.
    `,
    contentEn: `
      Emotional intelligence helps children succeed in future relationships:
      1. Naming feelings: Help your child name what they feel (sad, angry, happy).
      2. Empathy: Show empathy for their feelings and don't dismiss them.
      3. Problem solving: Teach the child how to calm down before making decisions.
      4. Self-motivation: Encourage them to try again when they fail.
    `
  }
];

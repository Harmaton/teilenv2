export type ExperienceType = "familias" | "educacion" | "profesionales";

export type Experience = {
  type: ExperienceType;
  country: string;
  quote: string;
  full: string;
  name: string;
  role: string;
  location: string;
  initials: string;
  profile?: string;
  profileKind?: "Instagram" | "LinkedIn";
};

export const experiences: Experience[] = [
  {
    type: "familias", country: "Costa Rica",
    quote: "Fue como ponerle nombre y estructura a muchas cosas que ya estaban ahí.",
    full: "Mi hija de 17 años está decidiendo qué estudiar. Le apasiona la neurociencia desde la investigación, una carrera que todavía no se ofrece en nuestro país. Como mamá quería acompañarla sin imponerle una decisión, ayudándola a conocerse mejor. Lo que más me llamó la atención fue que el informe reconociera rasgos que yo también veo en ella: en sus estudios, sus pasatiempos, su forma de aprender y lo que despierta su curiosidad. Fue como ponerle nombre y estructura a muchas cosas que ya estaban ahí. Lo más valioso es que no le dice «esta es la carrera que debes estudiar»: le da información para conocerse, explorar y decidir de forma más consciente. Me permitió acompañarla desde otro lugar: no desde mis expectativas, sino desde sus fortalezas.",
    name: "Dylana Alvarado Coto", role: "Madre · Administradora de empresas", location: "Cartago, Costa Rica", initials: "DA", profile: "https://www.instagram.com/dylana_alvarado", profileKind: "Instagram",
  },
  {
    type: "educacion", country: "Chile",
    quote: "La dificultad de nuestros estudiantes no es la falta de información, sino la falta de acompañamiento.",
    full: "La principal dificultad de nuestros estudiantes no es la falta de información, sino la falta de acompañamiento, sobre todo cuando deben tomar decisiones importantes sobre su futuro. Muchos se sienten solos y, además, son los primeros de su familia en llegar a la educación superior. Me gustó mucho Teilen: es amigable, cómoda y fácil de usar, con una propuesta gráfica entretenida. Entrega información precisa y significativa y construye un perfil de personalidad que se siente muy cercano a la realidad. Es una excelente herramienta para acompañar a los estudiantes en su autoconocimiento y en sus decisiones.",
    name: "Juan Pablo Chavarría S.", role: "Orientador vocacional", location: "Santiago, Chile", initials: "JC",
  },
  {
    type: "profesionales", country: "Nicaragua",
    quote: "Una lectura sólida y constructiva, tanto en lo personal como en lo profesional.",
    full: "Teilen me dio información detallada y clara para identificar los aspectos que debo seguir potenciando en mi vida. Tiene una lectura sólida y constructiva, tanto en lo personal como en lo profesional. Me resulta útil para tomar decisiones con determinación y para entender el impacto que mi comportamiento tiene en las personas que me rodean. Me encantó la herramienta y la experiencia que construye.",
    name: "Tommy Joseph Díaz Valverde", role: "Coaching profesional y psicología organizacional positiva", location: "Granada, Nicaragua", initials: "TD", profile: "https://www.instagram.com/tommy.diaz_", profileKind: "Instagram",
  },
  {
    type: "familias", country: "Perú",
    quote: "Me sorprendió el alcance y la exactitud con que el sistema definió a mis dos hijos.",
    full: "Me fascinó la primera edición de Teilen, que mostraba de forma gráfica la evolución y la madurez de distintas áreas del cerebro. Me mostró qué capacidades tenía desarrolladas y cuáles debía trabajar. Por eso esperé la versión para jóvenes y se la hice completar a mis dos hijos, de 18 y 21 años, que tienen personalidades muy diferentes. Me sorprendió el alcance y la exactitud con que el sistema los definió. Como madre, me importa saber qué competencias para la vida les falta desarrollar. Para mí es un mapa para guiarlos, darles retos y herramientas, y también para soltarlos en los desafíos que se les presenten, sin negarles esa experiencia.",
    name: "María del Carmen Dejo Bendezú", role: "Madre · Administradora y psicóloga organizacional", location: "Perú", initials: "MD", profile: "https://www.linkedin.com/company/family-coach-corp", profileKind: "LinkedIn",
  },
  {
    type: "educacion", country: "Perú",
    quote: "Teilen llegó a mi vida personal y profesional en el momento indicado.",
    full: "En nuestra escuela pedagógica conviven estudiantes adultos entusiastas y comprometidos con la carrera que eligieron, y otros que trabajan para sostener a sus familias y cargan dificultades desde la infancia y la adolescencia. A muchos no les queda tiempo para pensar en sí mismos, en su futuro ni en las decisiones que tomaron. Teilen llegó a mi vida personal y profesional en el momento indicado. Conocerme más, descubrir mis talentos, habilidades, estilo de aprendizaje y potencial me ha permitido acercarme mejor a ellos, escucharlos con atención y ayudarlos a construir su proyecto de vida. En la vida todo tiene un propósito, y la misión es ser: pensando en ti y en los demás.",
    name: "Jahzeel Alexia Inga Vela", role: "Directora de la Escuela de Educación Superior Pedagógica Pública «Loreto»", location: "Iquitos, Perú", initials: "JI", profile: "https://www.instagram.com/jahzeel.inga26", profileKind: "Instagram",
  },
  {
    type: "profesionales", country: "Ecuador",
    quote: "Los resultados se convirtieron en acciones concretas para crecer.",
    full: "Lo más valioso fue identificar mis fortalezas, competencias y oportunidades de mejora a partir de las expectativas de la empresa y del perfil del puesto. Me dio una perspectiva más objetiva sobre mis competencias y me motivó a fijar nuevos objetivos: los resultados se convirtieron en acciones concretas. Creo que aporta en cualquier momento de la vida personal o profesional, y sobre todo ante un cambio de trabajo, una nueva formación o mayores responsabilidades, porque te prepara para afrontarlos con más confianza.",
    name: "Mónica Guadalupe Larrea Flores", role: "Doctora en Psicología Industrial · Coach", location: "Quito, Ecuador", initials: "ML", profile: "https://www.linkedin.com/in/coachguadalupel", profileKind: "LinkedIn",
  },
  {
    type: "familias", country: "Argentina",
    quote: "Fue una oportunidad para mirar con más atención y abrir espacios de diálogo en familia.",
    full: "Me motivó la posibilidad de conocer mejor a mi hija y tener una herramienta para acompañarla de forma más atenta y cercana, sin sentir que como mamá estoy fuera de eje con ella. Me sirvió para detenerme a observar aspectos suyos que, entre las actividades y preocupaciones de todos los días, pasan inadvertidos. El informe me invitó a pensar cómo acompañarla y cómo conversar con ella. A otros padres les diría que Teilen ayuda a conocer mejor a nuestros hijos y a pensar cómo acompañarlos. Para mí fue una oportunidad para mirar con más atención y abrir espacios de diálogo en familia.",
    name: "Melisa Natalí Bellesi Libertino", role: "Madre · Preceptora y estudiante de Recursos Humanos", location: "Córdoba, Argentina", initials: "MB", profile: "https://www.linkedin.com/in/melisa-bellesi-libertino-006b7a335", profileKind: "LinkedIn",
  },
  {
    type: "educacion", country: "Chile",
    quote: "El informe devuelve claridad sobre la identidad y saca a la luz fortalezas que, después del test, parecen obvias.",
    full: "La dinámica es completa, directa y práctica. Se agradece que sea ágil y simple, y que aclare desde el inicio de qué se trata. A los adolescentes —y a mí también— nos gusta la interacción que moviliza, y esta lo logra. Es útil, enfocada y coherente con jóvenes dispuestos a abrir esa parte de sus vidas. El informe devuelve claridad sobre la identidad personal y saca a la luz fortalezas valiosas que no se reconocían y que, después del test, parecen obvias.",
    name: "Lucas Miguel Fanoni", role: "Profesor de enseñanza general básica · Premio Nacional Buenas Ideas 2026 de la Superintendencia de Educación de Chile por «Transformando emociones»", location: "Santiago, Chile", initials: "LF", profile: "https://www.instagram.com/_un_lucas", profileKind: "Instagram",
  },
  {
    type: "profesionales", country: "Bolivia",
    quote: "Ayuda a reconocer habilidades que quizás aún no sabes que tienes.",
    full: "Lo usé con hijos de algunos clientes que cursaban su último año de colegio y necesitaban orientación para elegir qué estudiar. Les ayudó a comprender sus habilidades, su forma de pensar y si responden más desde la lógica o desde las emociones. Los resultados también permitieron que ellos y sus padres reconocieran sus tendencias, sus fortalezas y las áreas con mayor potencial. Teilen permite conocer de manera profesional las tendencias de tu forma de pensar y reconocer habilidades que quizás aún no sabes que tienes, sobre todo antes de las grandes decisiones sobre el futuro.",
    name: "Mirtha Susana Araujo Camacho", role: "Coach profesional · Lic. en Comunicación Social · Facilitadora en constelaciones familiares y organizacionales", location: "La Paz, Bolivia", initials: "MA",
  },
  {
    type: "familias", country: "Colombia",
    quote: "Es rápido y sencillo: en minutos tienes un punto de partida para acompañar a tu hijo con propósito.",
    full: "Hice Teilen para entender cómo funciona la mente de mi hija. El informe me ayudó a ver que tiene habilidades que la orientan hacia las humanidades y que en el futuro podría estudiar algo vinculado con la medicina, los animales o la naturaleza. A otros padres les diría: si no comprendes el comportamiento de tu hijo o tienes dudas sobre qué podría estudiar, prueba Teilen. Es rápido y sencillo, no te lleva horas ni días: en minutos tienes un punto de partida para empezar un plan de trabajo con propósito para tu hijo.",
    name: "Valeria Gómez Montaña", role: "Madre · Comunicadora social y periodista", location: "Bogotá, Colombia", initials: "VG", profile: "https://www.instagram.com/valeriagomezmon", profileKind: "Instagram",
  },
  {
    type: "educacion", country: "Perú",
    quote: "Me pareció interesante que no se limite a decir qué carrera estudiar, sino que ayude a comprender a la persona.",
    full: "Uno de los principales desafíos es ayudar a los estudiantes a conocerse e identificar sus fortalezas, intereses y capacidades para decidir mejor sobre su futuro. Muchas veces la orientación se concentra en conocer carreras, pero no parte de reconocer quién es el estudiante, qué lo motiva y en qué puede destacar. Valoro que Teilen parta del autoconocimiento. Al probarlo, me pareció interesante que no se limite a decir qué carrera estudiar, sino que ayude a comprender el perfil de la persona y, desde ahí, explorar posibilidades. Además, la información sirve como punto de partida para conversar con los estudiantes y acompañarlos de forma más personalizada.",
    name: "Jorge Luis Cruz Peñaherrera", role: "Docente y jefe de gestión pedagógica", location: "Lima, Perú", initials: "JC", profile: "https://www.linkedin.com/in/jorge-luis-cruz-pe%C3%B1aherrera-28682714a", profileKind: "LinkedIn",
  },
  {
    type: "familias", country: "Argentina",
    quote: "Es como un GPS, con información fácil de entender para tu hijo.",
    full: "Mi hijo estaba preocupado por qué hacer con su vida, y esta herramienta me pareció útil para darle soporte: que conozca sus habilidades y capacidades, y cómo aplicarlas en la práctica. Teilen ayuda a que tu hijo descubra lo que hay dentro suyo, su singularidad, y cómo usarla a su favor en la búsqueda de qué hacer con su vida. Es como un GPS, con información fácil de entender para él o para ella.",
    name: "David Nicolás Vargas", role: "Padre · Consultor, empresario y contador público", location: "San Miguel, Buenos Aires, Argentina", initials: "DV", profile: "https://www.instagram.com/nicovargascoach", profileKind: "Instagram",
  },
  {
    type: "educacion", country: "Perú",
    quote: "Lo principal es que conecta el talento personal con el aporte al mundo.",
    full: "Los jóvenes enfrentan demasiada o muy poca información sobre carreras, expectativas familiares, tradiciones y profesiones idealizadas. Por dentro aparecen bloqueos, indecisión, miedo a la incertidumbre y pánico a «no ser exitosos», y les cuesta defender lo que quieren frente a la presión de la familia o los amigos. De Teilen valoro que ayude a identificar bloqueos y fortalezas personales y a ganar claridad para decidir al margen de los intereses de padres y amigos. Y, sobre todo, que conecte el talento personal con el aporte al mundo.",
    name: "Ana Laureana Bullón Zambrano", role: "Guía Montessori por más de 30 años · Docente de inicial y primaria", location: "Lima, Perú", initials: "AB", profile: "https://www.instagram.com/montessoriana_coach/", profileKind: "Instagram",
  },
  {
    type: "educacion", country: "Ecuador",
    quote: "Ofrece información objetiva para orientar decisiones y planificar trayectorias académicas y ocupacionales.",
    full: "Uno de los desafíos de los colegios es una orientación integral y personalizada: identificar intereses, aptitudes y habilidades, apoyar la toma de decisiones y acompañar el proyecto de vida, con herramientas objetivas y basadas en evidencia. Teilen aborda estos temas porque explora de forma sistemática los intereses, las aptitudes y las características de cada persona, y ofrece información objetiva para orientar decisiones y planificar trayectorias académicas y ocupacionales.",
    name: "Martha Beatriz Avecilla Armijos", role: "Psicóloga clínica · Maestrante en Neuropsicología educativa", location: "Manabí, Ecuador", initials: "MA", profile: "https://www.instagram.com/dra.marthaavecilla", profileKind: "Instagram",
  },
  {
    type: "educacion", country: "Perú",
    quote: "Me permitió comprender cómo cada estudiante se relaciona con sus decisiones y con su entorno.",
    full: "A los jóvenes les falta autoconocimiento para reconocer quiénes son, qué valoran y cuáles son sus fortalezas, y claridad de propósito para proyectarse y decidir con criterio. Teilen me permitió comprender mejor cómo cada estudiante se relaciona con sus decisiones y con su entorno, y desde ahí acompañarlo con preguntas que amplíen su mirada sobre las posibilidades de su futuro.",
    name: "Mary Carmen Arteta", role: "Coach profesional y de propósito · Veterinaria", location: "Lima, Perú", initials: "MA", profile: "https://www.linkedin.com/in/mary-carmen-arteta-coach", profileKind: "LinkedIn",
  },
];

export const experienceCategories: { id: "todas" | ExperienceType; label: string; count: number }[] = [
  { id: "todas", label: "Todas", count: 15 },
  { id: "familias", label: "Familias", count: 5 },
  { id: "educacion", label: "Educación", count: 7 },
  { id: "profesionales", label: "Profesionales", count: 3 },
];

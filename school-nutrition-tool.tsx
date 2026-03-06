import { useState, useMemo, useRef, useCallback } from "react";
import { RotateCcw, Printer, Save, BookOpen, ChefHat, CheckCircle, CalendarDays, BarChart3, Leaf, UtensilsCrossed, Milk, Apple, Wheat, Drumstick, X, ChevronDown, Search, Edit, Info } from "lucide-react";

// ─── Brand Tokens ───
const C = {
  green: "#679436",
  blue: "#05668D",
  yellow: "#F0D173",
  lightBlue: "#D5E6F1",
  white: "#FFFFFF",
  slate: "#1D363D",
};

const font = {
  header: "'Roboto Slab', 'Arial Black', sans-serif",
  body: "'Montserrat', Arial, sans-serif",
};

// ─── Data ───
const INITIAL_RECIPES = [
  { id:1, name:"Chicken Tenders", category:"Entrée", yield:50, servingSize:"3 pieces (85g)", ingredients:[{name:"Chicken breast, boneless",qty:12,unit:"lb"},{name:"Whole wheat breadcrumbs",qty:4,unit:"cups"},{name:"Eggs",qty:8,unit:"each"},{name:"All-purpose flour",qty:2,unit:"cups"},{name:"Garlic powder",qty:2,unit:"tbsp"},{name:"Paprika",qty:1,unit:"tbsp"},{name:"Salt",qty:1,unit:"tbsp"},{name:"Canola oil spray",qty:1,unit:"can"}], nutrition:{calories:210,totalFat:7,saturatedFat:1.5,transFat:0,cholesterol:65,sodium:340,totalCarbs:12,fiber:1,totalSugars:0,addedSugars:0,protein:24,vitaminD:0.1,calcium:20,iron:1.2,potassium:220}},
  { id:2, name:"Beef Taco Meat", category:"Entrée", yield:50, servingSize:"1/2 cup (120g)", ingredients:[{name:"Ground beef 80/20",qty:15,unit:"lb"},{name:"Onion, diced",qty:3,unit:"cups"},{name:"Tomato sauce",qty:4,unit:"cups"},{name:"Chili powder",qty:4,unit:"tbsp"},{name:"Cumin",qty:3,unit:"tbsp"},{name:"Garlic powder",qty:2,unit:"tbsp"},{name:"Salt",qty:1,unit:"tbsp"}], nutrition:{calories:245,totalFat:14,saturatedFat:5.5,transFat:0.8,cholesterol:70,sodium:410,totalCarbs:5,fiber:1,totalSugars:2,addedSugars:0,protein:22,vitaminD:0,calcium:35,iron:3.2,potassium:340}},
  { id:3, name:"Homemade Mac & Cheese", category:"Grain", yield:50, servingSize:"1 cup (200g)", ingredients:[{name:"Whole wheat elbow pasta",qty:6,unit:"lb"},{name:"Low-fat cheddar cheese",qty:4,unit:"lb"},{name:"1% milk",qty:8,unit:"cups"},{name:"Butter",qty:0.5,unit:"lb"},{name:"All-purpose flour",qty:1.5,unit:"cups"},{name:"Dry mustard",qty:1,unit:"tbsp"},{name:"Salt",qty:2,unit:"tsp"}], nutrition:{calories:310,totalFat:11,saturatedFat:6,transFat:0.3,cholesterol:30,sodium:480,totalCarbs:38,fiber:3,totalSugars:4,addedSugars:0,protein:16,vitaminD:0.5,calcium:280,iron:1.8,potassium:180}},
  { id:4, name:"Garden Salad with Ranch", category:"Vegetable", yield:50, servingSize:"1 cup (100g)", ingredients:[{name:"Romaine lettuce, chopped",qty:8,unit:"lb"},{name:"Cherry tomatoes, halved",qty:3,unit:"lb"},{name:"Cucumber, sliced",qty:3,unit:"lb"},{name:"Shredded carrots",qty:2,unit:"lb"},{name:"Light ranch dressing",qty:4,unit:"cups"}], nutrition:{calories:75,totalFat:4,saturatedFat:0.5,transFat:0,cholesterol:5,sodium:190,totalCarbs:8,fiber:2,totalSugars:3,addedSugars:1,protein:2,vitaminD:0,calcium:30,iron:0.8,potassium:260}},
  { id:5, name:"Whole Wheat Dinner Roll", category:"Grain", yield:100, servingSize:"1 roll (45g)", ingredients:[{name:"Whole wheat flour",qty:8,unit:"lb"},{name:"Bread flour",qty:4,unit:"lb"},{name:"Sugar",qty:1,unit:"cup"},{name:"Salt",qty:3,unit:"tbsp"},{name:"Active dry yeast",qty:4,unit:"tbsp"},{name:"Canola oil",qty:1,unit:"cup"},{name:"Water, warm",qty:6,unit:"cups"}], nutrition:{calories:120,totalFat:2.5,saturatedFat:0.3,transFat:0,cholesterol:0,sodium:180,totalCarbs:22,fiber:3,totalSugars:3,addedSugars:2,protein:4,vitaminD:0,calcium:15,iron:1.1,potassium:70}},
  { id:6, name:"Steamed Broccoli", category:"Vegetable", yield:50, servingSize:"1/2 cup (78g)", ingredients:[{name:"Broccoli florets, frozen",qty:15,unit:"lb"},{name:"Salt",qty:1,unit:"tsp"},{name:"Garlic powder",qty:1,unit:"tbsp"}], nutrition:{calories:30,totalFat:0,saturatedFat:0,transFat:0,cholesterol:0,sodium:30,totalCarbs:6,fiber:2.5,totalSugars:1.5,addedSugars:0,protein:2.5,vitaminD:0,calcium:40,iron:0.6,potassium:230}},
  { id:7, name:"Fresh Fruit Cup", category:"Fruit", yield:50, servingSize:"1/2 cup (120g)", ingredients:[{name:"Strawberries, sliced",qty:5,unit:"lb"},{name:"Cantaloupe, diced",qty:5,unit:"lb"},{name:"Grapes, halved",qty:4,unit:"lb"},{name:"Honeydew, diced",qty:4,unit:"lb"}], nutrition:{calories:50,totalFat:0,saturatedFat:0,transFat:0,cholesterol:0,sodium:10,totalCarbs:13,fiber:1.5,totalSugars:10,addedSugars:0,protein:0.5,vitaminD:0,calcium:12,iron:0.3,potassium:190}},
  { id:8, name:"Baked Fish Sticks", category:"Entrée", yield:50, servingSize:"4 pieces (100g)", ingredients:[{name:"Pollock fillets",qty:12,unit:"lb"},{name:"Whole wheat panko",qty:3,unit:"cups"},{name:"Cornmeal",qty:2,unit:"cups"},{name:"Eggs",qty:6,unit:"each"},{name:"Lemon juice",qty:0.5,unit:"cups"},{name:"Old Bay seasoning",qty:2,unit:"tbsp"}], nutrition:{calories:195,totalFat:5,saturatedFat:1,transFat:0,cholesterol:55,sodium:320,totalCarbs:15,fiber:1,totalSugars:0,addedSugars:0,protein:22,vitaminD:1.2,calcium:25,iron:1,potassium:300}},
  { id:9, name:"Seasoned Brown Rice", category:"Grain", yield:50, servingSize:"1/2 cup (120g)", ingredients:[{name:"Brown rice",qty:8,unit:"lb"},{name:"Low-sodium chicken broth",qty:16,unit:"cups"},{name:"Garlic, minced",qty:4,unit:"tbsp"},{name:"Dried parsley",qty:2,unit:"tbsp"},{name:"Salt",qty:1,unit:"tsp"}], nutrition:{calories:140,totalFat:1.5,saturatedFat:0.3,transFat:0,cholesterol:0,sodium:150,totalCarbs:28,fiber:2,totalSugars:0,addedSugars:0,protein:3,vitaminD:0,calcium:10,iron:0.8,potassium:80}},
  { id:10, name:"Applesauce Cup", category:"Fruit", yield:50, servingSize:"1/2 cup (120g)", ingredients:[{name:"Apples, peeled & diced",qty:20,unit:"lb"},{name:"Water",qty:4,unit:"cups"},{name:"Cinnamon",qty:2,unit:"tbsp"}], nutrition:{calories:60,totalFat:0,saturatedFat:0,transFat:0,cholesterol:0,sodium:5,totalCarbs:15,fiber:1.5,totalSugars:12,addedSugars:0,protein:0,vitaminD:0,calcium:6,iron:0.2,potassium:90}},
  { id:11, name:"WG Pancakes (2)", category:"WG Rich", yield:50, servingSize:"2 pancakes (90g)", ingredients:[{name:"Whole wheat flour",qty:6,unit:"lb"},{name:"Eggs",qty:12,unit:"each"},{name:"1% milk",qty:6,unit:"cups"},{name:"Canola oil",qty:1,unit:"cup"},{name:"Baking powder",qty:4,unit:"tbsp"},{name:"Sugar",qty:0.5,unit:"cups"}], nutrition:{calories:190,totalFat:5,saturatedFat:1,transFat:0,cholesterol:40,sodium:310,totalCarbs:30,fiber:3,totalSugars:6,addedSugars:4,protein:7,vitaminD:0.3,calcium:90,iron:1.4,potassium:120}},
  { id:12, name:"WG Blueberry Muffin", category:"WG Rich", yield:50, servingSize:"1 muffin (60g)", ingredients:[{name:"Whole wheat flour",qty:5,unit:"lb"},{name:"Blueberries, frozen",qty:3,unit:"lb"},{name:"Sugar",qty:2,unit:"cups"},{name:"Canola oil",qty:1.5,unit:"cups"},{name:"Eggs",qty:8,unit:"each"},{name:"Baking powder",qty:3,unit:"tbsp"}], nutrition:{calories:175,totalFat:6,saturatedFat:0.8,transFat:0,cholesterol:25,sodium:220,totalCarbs:27,fiber:2.5,totalSugars:12,addedSugars:8,protein:4,vitaminD:0.1,calcium:45,iron:1.2,potassium:85}},
  { id:13, name:"WG Cinnamon Toast", category:"WG Rich", yield:50, servingSize:"1 slice (40g)", ingredients:[{name:"Whole wheat bread",qty:50,unit:"each"},{name:"Butter",qty:1,unit:"lb"},{name:"Cinnamon sugar mix",qty:2,unit:"cups"}], nutrition:{calories:140,totalFat:5,saturatedFat:2.5,transFat:0.1,cholesterol:10,sodium:170,totalCarbs:20,fiber:2,totalSugars:6,addedSugars:4,protein:3,vitaminD:0,calcium:30,iron:1,potassium:60}},
  { id:14, name:"Scrambled Eggs", category:"Protein", yield:50, servingSize:"1/2 cup (60g)", ingredients:[{name:"Eggs, whole",qty:100,unit:"each"},{name:"1% milk",qty:2,unit:"cups"},{name:"Salt",qty:1,unit:"tsp"},{name:"Butter",qty:0.25,unit:"lb"}], nutrition:{calories:150,totalFat:10,saturatedFat:3.5,transFat:0.2,cholesterol:370,sodium:230,totalCarbs:1,fiber:0,totalSugars:1,addedSugars:0,protein:12,vitaminD:2,calcium:56,iron:1.8,potassium:140}},
  { id:15, name:"Turkey Sausage Patty", category:"Protein", yield:50, servingSize:"1 patty (45g)", ingredients:[{name:"Ground turkey",qty:8,unit:"lb"},{name:"Sage",qty:2,unit:"tbsp"},{name:"Garlic powder",qty:1,unit:"tbsp"},{name:"Salt",qty:1,unit:"tsp"},{name:"Black pepper",qty:1,unit:"tsp"}], nutrition:{calories:90,totalFat:5,saturatedFat:1.5,transFat:0,cholesterol:45,sodium:260,totalCarbs:0,fiber:0,totalSugars:0,addedSugars:0,protein:11,vitaminD:0.2,calcium:15,iron:1,potassium:160}},
  { id:16, name:"Banana (1 medium)", category:"Fruit", yield:50, servingSize:"1 medium (118g)", ingredients:[{name:"Bananas, medium",qty:50,unit:"each"}], nutrition:{calories:105,totalFat:0.4,saturatedFat:0.1,transFat:0,cholesterol:0,sodium:1,totalCarbs:27,fiber:3.1,totalSugars:14,addedSugars:0,protein:1.3,vitaminD:0,calcium:6,iron:0.3,potassium:422}},
  { id:17, name:"Orange Juice (4oz)", category:"Fruit", yield:50, servingSize:"4 fl oz (120ml)", ingredients:[{name:"100% Orange Juice",qty:2,unit:"gal"}], nutrition:{calories:56,totalFat:0,saturatedFat:0,transFat:0,cholesterol:0,sodium:1,totalCarbs:13,fiber:0.2,totalSugars:10,addedSugars:0,protein:0.8,vitaminD:0,calcium:14,iron:0.2,potassium:248}},
];

const MILK_ITEM = { id:99, name:"1% Low-Fat Milk", category:"Milk", nutrition:{calories:100,totalFat:2.5,saturatedFat:1.5,transFat:0,cholesterol:12,sodium:105,totalCarbs:12,fiber:0,totalSugars:12,addedSugars:0,protein:8,vitaminD:2.5,calcium:305,iron:0,potassium:366}};

const USDA_LIMITS = {
  "K-5":{calories:{min:550,max:650},sodium:1230,saturatedFatPct:10,grainOz:1,meatOz:1,vegCup:0.75,fruitCup:0.5,milkCup:1},
  "6-8":{calories:{min:600,max:700},sodium:1360,saturatedFatPct:10,grainOz:1,meatOz:1,vegCup:0.75,fruitCup:0.5,milkCup:1},
  "9-12":{calories:{min:750,max:850},sodium:1420,saturatedFatPct:10,grainOz:2,meatOz:2,vegCup:1,fruitCup:1,milkCup:1}
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const BK_COMPS = [
  {key:"bk_grain",label:"Whole Grain Rich",cat:"WG Rich",color:"#d97706"},
  {key:"bk_protein",label:"Protein",cat:"Protein",color:"#b91c1c"},
  {key:"bk_fruit",label:"Fruit",cat:"Fruit",color:"#7c3aed"},
  {key:"bk_milk",label:"Milk",cat:"Milk",color:C.blue}
];
const LN_COMPS = [
  {key:"ln_entree",label:"Entrée",cat:"Entrée",color:"#b91c1c"},
  {key:"ln_grain",label:"Grain",cat:"Grain",color:"#d97706"},
  {key:"ln_veg",label:"Vegetable",cat:"Vegetable",color:C.green},
  {key:"ln_fruit",label:"Fruit",cat:"Fruit",color:"#7c3aed"},
  {key:"ln_milk",label:"Milk",cat:"Milk",color:C.blue}
];
const ALL_COMPS = [...BK_COMPS,...LN_COMPS];

// ─── Styled Components ───
const Btn = ({children, variant="primary", icon:Icon, className="", ...props}) => {
  const styles = {
    primary: {backgroundColor:C.green, color:"#fff", border:"none"},
    secondary: {backgroundColor:C.blue, color:"#fff", border:"none"},
    outline: {backgroundColor:"transparent", color:C.slate, border:`1.5px solid ${C.slate}22`},
    ghost: {backgroundColor:"transparent", color:C.slate, border:"none"},
    danger: {backgroundColor:"#dc2626", color:"#fff", border:"none"},
  };
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 px-4 py-2.5 ${className}`}
      style={{fontFamily:font.body,...styles[variant]}} {...props}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
};

const Card = ({children, className="",...props}) => (
  <div className={`bg-white rounded-xl border shadow-sm ${className}`} style={{borderColor:`${C.slate}12`}} {...props}>{children}</div>
);

const Input = ({className="",...props}) => (
  <input className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 ${className}`}
    style={{fontFamily:font.body, borderColor:`${C.slate}22`, focusRingColor:C.green}} {...props} />
);

const Sel = ({children, className="",...props}) => (
  <select className={`h-10 rounded-lg border px-3 text-sm bg-white focus:outline-none focus:ring-2 ${className}`}
    style={{fontFamily:font.body, borderColor:`${C.slate}22`}} {...props}>{children}</select>
);

const Badge = ({children, color=C.green}) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    style={{backgroundColor:`${color}15`, color, border:`1px solid ${color}30`, fontFamily:font.body}}>{children}</span>
);

const SectionHeader = ({children, icon:Icon}) => (
  <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{fontFamily:font.header, fontWeight:700, color:C.blue}}>
    {Icon && <Icon size={20} fill={C.blue} />}{children}
  </h2>
);

const Dialog = ({open,onClose,title,children}) => {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:`${C.slate}12`}}>
          <h2 className="font-bold text-lg" style={{fontFamily:font.header,color:C.slate}}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} color={C.slate}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ─── Logo ───
const Logo = () => (
  <div className="flex items-center justify-center gap-0.5">
    <span className="text-2xl font-black tracking-tight" style={{fontFamily:font.header, fontWeight:900, color:C.green}}>
      Sprou<span className="relative">t<span className="absolute -top-1 -right-1" style={{color:C.green, fontSize:10}}>🌿</span></span>
    </span>
    <span className="text-2xl font-black tracking-tight" style={{fontFamily:font.header, fontWeight:900, color:C.blue}}>CNP</span>
  </div>
);

// ─── Header Bar ───
const HeaderBar = ({onReset, onPrint, onSave}) => (
  <div className="bg-white border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3" style={{borderColor:`${C.slate}12`}}>
    <Logo />
    <div className="flex items-center gap-1 text-xs" style={{color:`${C.slate}88`, fontFamily:font.body}}>
      <Info size={12}/> info@sproutcnp.com
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <Btn variant="outline" icon={RotateCcw} onClick={onReset}>Reset All</Btn>
      <Btn variant="secondary" icon={Printer} onClick={onPrint}>Print Page</Btn>
      <Btn variant="primary" icon={Save} onClick={onSave}>Save to File</Btn>
    </div>
  </div>
);

// ─── Nutrition Label ───
const NutritionLabel = ({nutrition, servingSize="1 serving"}) => {
  const n = nutrition||{};
  const dv = (v,d) => d ? Math.round((v/d)*100) : 0;
  const R = (l,v,u,d,b=false,ind=false) => (
    <div className={`flex justify-between py-0.5 ${b?'font-bold':''} ${ind?'pl-4':''}`} style={{fontFamily:font.body}}>
      <span>{l} {v!==undefined?`${Math.round(v*10)/10}${u}`:''}</span>
      {d?<span className="font-bold">{dv(v,d)}%</span>:<span/>}
    </div>
  );
  return (
    <div className="border-2 border-black p-2 max-w-xs bg-white" style={{fontFamily:"Helvetica, Arial, sans-serif"}}>
      <div className="text-3xl font-extrabold leading-none">Nutrition Facts</div>
      <div className="border-b border-black pb-1 mb-1 text-sm">Serving size {servingSize}</div>
      <div className="border-b-8 border-black pb-1 mb-1">
        <div className="text-sm font-bold">Amount per serving</div>
        <div className="flex justify-between items-end"><span className="text-3xl font-extrabold">Calories</span><span className="text-4xl font-extrabold">{Math.round(n.calories||0)}</span></div>
      </div>
      <div className="text-sm text-right font-bold border-b border-gray-400 pb-0.5 mb-0.5">% Daily Value*</div>
      <div className="text-sm divide-y divide-gray-300">
        {R("Total Fat",n.totalFat,"g",78,true)}
        {R("Saturated Fat",n.saturatedFat,"g",20,false,true)}
        {R("Trans Fat",n.transFat,"g",null,false,true)}
        {R("Cholesterol",n.cholesterol,"mg",300,true)}
        {R("Sodium",n.sodium,"mg",2300,true)}
        {R("Total Carbohydrate",n.totalCarbs,"g",275,true)}
        {R("Dietary Fiber",n.fiber,"g",28,false,true)}
        {R("Total Sugars",n.totalSugars,"g",null,false,true)}
        <div className="pl-8 flex justify-between py-0.5"><span>Incl. {Math.round((n.addedSugars||0)*10)/10}g Added Sugars</span><span className="font-bold">{dv(n.addedSugars,50)}%</span></div>
        {R("Protein",n.protein,"g",50,true)}
      </div>
      <div className="border-t-8 border-black mt-1 pt-1 text-sm divide-y divide-gray-300">
        {R("Vitamin D",n.vitaminD,"mcg",20)}{R("Calcium",n.calcium,"mg",1300)}{R("Iron",n.iron,"mg",18)}{R("Potassium",n.potassium,"mg",4700)}
      </div>
      <div className="border-t border-black mt-1 pt-1 text-xs leading-tight" style={{color:`${C.slate}99`}}>
        * The % Daily Value tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
};

// ─── Views ───

// 1. Recipe Book
const RecipeBookView = ({recipes, onView}) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())), [recipes,search]);
  return (
    <div>
      <SectionHeader icon={BookOpen}>Recipe Book</SectionHeader>
      <p className="text-sm mb-4" style={{fontFamily:font.body, color:`${C.slate}99`}}>{recipes.length} recipes in your collection</p>
      <div className="relative max-w-md mb-5">
        <Search size={16} className="absolute left-3 top-3" style={{color:`${C.slate}55`}}/>
        <Input placeholder="Search recipes..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9"/>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(r => (
          <Card key={r.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={()=>onView(r)}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-base leading-tight" style={{fontFamily:font.header, color:C.slate}}>{r.name}</h3>
                <Badge color={C.blue}>{r.category}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[{l:"Yield",v:r.yield},{l:"Cal/srv",v:r.nutrition.calories},{l:"Na mg",v:r.nutrition.sodium}].map(({l,v})=>(
                  <div key={l} className="rounded-lg p-2" style={{backgroundColor:C.lightBlue}}>
                    <div className="text-lg font-bold" style={{color:C.green, fontFamily:font.header}}>{v}</div>
                    <div className="text-xs" style={{color:`${C.slate}88`, fontFamily:font.body}}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs" style={{color:`${C.slate}77`, fontFamily:font.body}}>Serving: {r.servingSize}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 2. Recipe Builder
const RecipeBuilderView = ({onSave, editRecipe}) => {
  const [name,setName]=useState(editRecipe?.name||"");
  const [category,setCategory]=useState(editRecipe?.category||"Entrée");
  const [yld,setYld]=useState(editRecipe?.yield||50);
  const [servingSize,setServingSize]=useState(editRecipe?.servingSize||"1 serving");
  const [ingredients,setIngredients]=useState(editRecipe?.ingredients||[]);
  const [ingName,setIngName]=useState("");const [ingQty,setIngQty]=useState("");const [ingUnit,setIngUnit]=useState("lb");
  const [nutrition,setNutrition]=useState(editRecipe?.nutrition||{calories:0,totalFat:0,saturatedFat:0,transFat:0,cholesterol:0,sodium:0,totalCarbs:0,fiber:0,totalSugars:0,addedSugars:0,protein:0,vitaminD:0,calcium:0,iron:0,potassium:0});

  const NDB={chicken:{calories:165,totalFat:3.6,saturatedFat:1,transFat:0,cholesterol:85,sodium:74,totalCarbs:0,fiber:0,totalSugars:0,addedSugars:0,protein:31,vitaminD:0.1,calcium:11,iron:0.7,potassium:256},beef:{calories:250,totalFat:17,saturatedFat:6.5,transFat:1,cholesterol:80,sodium:72,totalCarbs:0,fiber:0,totalSugars:0,addedSugars:0,protein:26,vitaminD:0,calcium:18,iron:2.6,potassium:315},rice:{calories:130,totalFat:0.3,saturatedFat:0.1,transFat:0,cholesterol:0,sodium:1,totalCarbs:28,fiber:0.4,totalSugars:0,addedSugars:0,protein:2.7,vitaminD:0,calcium:10,iron:0.2,potassium:35},pasta:{calories:158,totalFat:0.9,saturatedFat:0.2,transFat:0,cholesterol:0,sodium:1,totalCarbs:31,fiber:1.8,totalSugars:0.6,addedSugars:0,protein:5.8,vitaminD:0,calcium:7,iron:1,potassium:44},cheese:{calories:113,totalFat:9.3,saturatedFat:5.9,transFat:0.3,cholesterol:28,sodium:174,totalCarbs:0.4,fiber:0,totalSugars:0.1,addedSugars:0,protein:7,vitaminD:0.1,calcium:200,iron:0.2,potassium:21},egg:{calories:72,totalFat:5,saturatedFat:1.6,transFat:0,cholesterol:186,sodium:71,totalCarbs:0.4,fiber:0,totalSugars:0.2,addedSugars:0,protein:6.3,vitaminD:1,calcium:28,iron:0.9,potassium:69}};

  const addIng = () => {
    if(!ingName||!ingQty) return;
    setIngredients(p=>[...p,{name:ingName,qty:parseFloat(ingQty),unit:ingUnit}]);
    const k=Object.keys(NDB).find(k=>ingName.toLowerCase().includes(k));
    if(k){const f=parseFloat(ingQty)/(yld||50);const n=NDB[k];setNutrition(p=>{const x={...p};Object.keys(n).forEach(k=>{x[k]=Math.round((p[k]+n[k]*f)*10)/10});return x});}
    setIngName("");setIngQty("");setIngUnit("lb");
  };

  return (
    <div>
      <SectionHeader icon={ChefHat}>{editRecipe?"Edit Recipe":"Recipe Builder"}</SectionHeader>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-bold text-sm" style={{fontFamily:font.header,color:C.slate}}>Recipe Details</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold mb-1 block" style={{color:`${C.slate}88`,fontFamily:font.body}}>Name</label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Chicken Tenders"/></div>
              <div><label className="text-xs font-semibold mb-1 block" style={{color:`${C.slate}88`,fontFamily:font.body}}>Category</label>
                <Sel value={category} onChange={e=>setCategory(e.target.value)} className="w-full">
                  {["Entrée","Grain","WG Rich","Vegetable","Fruit","Protein","Milk"].map(c=><option key={c}>{c}</option>)}
                </Sel></div>
              <div><label className="text-xs font-semibold mb-1 block" style={{color:`${C.slate}88`,fontFamily:font.body}}>Yield</label><Input type="number" value={yld} onChange={e=>setYld(+e.target.value)}/></div>
              <div><label className="text-xs font-semibold mb-1 block" style={{color:`${C.slate}88`,fontFamily:font.body}}>Serving Size</label><Input value={servingSize} onChange={e=>setServingSize(e.target.value)}/></div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-3" style={{fontFamily:font.header,color:C.slate}}>Ingredients</h3>
            <div className="flex gap-2 mb-3 flex-wrap">
              <Input placeholder="Ingredient name" value={ingName} onChange={e=>setIngName(e.target.value)} className="flex-1 min-w-[140px]"/>
              <Input type="number" placeholder="Qty" value={ingQty} onChange={e=>setIngQty(e.target.value)} className="w-20"/>
              <Sel value={ingUnit} onChange={e=>setIngUnit(e.target.value)}>{["lb","oz","cups","tbsp","tsp","each","can","gal"].map(u=><option key={u}>{u}</option>)}</Sel>
              <Btn onClick={addIng} className="text-xs">+ Add</Btn>
            </div>
            {ingredients.length>0&&(
              <div className="border rounded-lg overflow-hidden" style={{borderColor:`${C.slate}15`}}>
                <table className="w-full text-sm" style={{fontFamily:font.body}}>
                  <thead><tr style={{backgroundColor:C.lightBlue}}><th className="p-2 text-left text-xs font-semibold" style={{color:C.blue}}>Ingredient</th><th className="p-2 text-left text-xs font-semibold" style={{color:C.blue}}>Qty</th><th className="p-2 text-left text-xs font-semibold" style={{color:C.blue}}>Unit</th><th className="p-2 w-8"></th></tr></thead>
                  <tbody>{ingredients.map((ing,i)=>(
                    <tr key={i} className="border-t" style={{borderColor:`${C.slate}10`}}><td className="p-2">{ing.name}</td><td className="p-2">{ing.qty}</td><td className="p-2">{ing.unit}</td>
                      <td className="p-2"><button onClick={()=>setIngredients(p=>p.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-600"><X size={14}/></button></td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-3" style={{fontFamily:font.header,color:C.slate}}>Manual Nutrition Override (per serving)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Object.keys(nutrition).map(k=>(
                <div key={k}><label className="text-xs" style={{color:`${C.slate}77`,fontFamily:font.body}}>{k}</label>
                  <Input type="number" value={nutrition[k]} onChange={e=>setNutrition(p=>({...p,[k]:parseFloat(e.target.value)||0}))} className="h-8 text-xs"/></div>
              ))}
            </div>
          </Card>
          <Btn onClick={()=>onSave({id:editRecipe?.id||Date.now(),name,category,yield:yld,servingSize,ingredients,nutrition})} icon={Save}>
            {editRecipe?"Update Recipe":"Save Recipe"}
          </Btn>
        </div>
        <div className="lg:col-span-2"><div className="sticky top-4">
          <h3 className="font-bold text-sm mb-3" style={{fontFamily:font.header,color:C.blue}}>Live Preview</h3>
          <NutritionLabel nutrition={nutrition} servingSize={servingSize}/>
        </div></div>
      </div>
    </div>
  );
};

// 3. Meal Pattern Checker
const MealPatternView = ({recipes}) => {
  const [sel,setSel]=useState({entree:"",grain:"",fruit:"",vegetable:"",milk:"1% Low-Fat Milk"});
  const [grade,setGrade]=useState("K-5");
  const byC=useMemo(()=>{const m={};recipes.forEach(r=>{if(!m[r.category])m[r.category]=[];m[r.category].push(r)});return m},[recipes]);
  const limits=USDA_LIMITS[grade];
  const selected=useMemo(()=>{const i=[];if(sel.entree)i.push(recipes.find(r=>r.name===sel.entree));if(sel.grain)i.push(recipes.find(r=>r.name===sel.grain));if(sel.fruit)i.push(recipes.find(r=>r.name===sel.fruit));if(sel.vegetable)i.push(recipes.find(r=>r.name===sel.vegetable));if(sel.milk)i.push(MILK_ITEM);return i.filter(Boolean)},[sel,recipes]);
  const totals=useMemo(()=>{const t={calories:0,sodium:0,saturatedFat:0,totalFat:0};selected.forEach(i=>{t.calories+=i.nutrition.calories;t.sodium+=i.nutrition.sodium;t.saturatedFat+=i.nutrition.saturatedFat;t.totalFat+=i.nutrition.totalFat});return t},[selected]);
  const sfp=totals.calories>0?((totals.saturatedFat*9)/totals.calories)*100:0;
  const checks=[
    {label:"Meat/Meat Alt",pass:!!sel.entree,note:sel.entree?`${limits.meatOz} oz eq ✓`:"Required"},
    {label:"Grain",pass:!!sel.grain,note:sel.grain?`${limits.grainOz} oz eq ✓`:"Required"},
    {label:"Fruit",pass:!!sel.fruit,note:sel.fruit?`${limits.fruitCup} cup ✓`:"Required"},
    {label:"Vegetable",pass:!!sel.vegetable,note:sel.vegetable?`${limits.vegCup} cup ✓`:"Required"},
    {label:"Milk",pass:!!sel.milk,note:sel.milk?`${limits.milkCup} cup ✓`:"Required"},
    {label:"Calories",pass:totals.calories>=limits.calories.min&&totals.calories<=limits.calories.max,note:`${totals.calories} / ${limits.calories.min}-${limits.calories.max}`},
    {label:"Sodium",pass:totals.sodium<=limits.sodium,note:`${totals.sodium}mg / ≤${limits.sodium}mg`},
    {label:"Sat. Fat <10%",pass:sfp<10||totals.calories===0,note:`${sfp.toFixed(1)}%`}
  ];
  const allPass=checks.every(c=>c.pass);

  return (
    <div>
      <SectionHeader icon={CheckCircle}>Meal Pattern Checker</SectionHeader>
      <p className="text-sm mb-6" style={{fontFamily:font.body,color:`${C.slate}88`}}>Verify USDA meal pattern compliance by grade group</p>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <label className="text-sm font-semibold" style={{fontFamily:font.body,color:C.slate}}>Grade Group</label>
            <Sel value={grade} onChange={e=>setGrade(e.target.value)}>{["K-5","6-8","9-12"].map(g=><option key={g}>{g}</option>)}</Sel>
          </div>
          {[{key:"entree",label:"Entrée / Meat Alt",cat:"Entrée"},{key:"grain",label:"Grain",cat:"Grain"},{key:"fruit",label:"Fruit",cat:"Fruit"},{key:"vegetable",label:"Vegetable",cat:"Vegetable"}].map(({key,label,cat})=>(
            <div key={key}><label className="text-xs font-semibold mb-1 block" style={{color:C.blue,fontFamily:font.body}}>{label}</label>
              <Sel value={sel[key]} onChange={e=>setSel(p=>({...p,[key]:e.target.value}))} className="w-full"><option value="">— Select —</option>{(byC[cat]||[]).map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</Sel></div>
          ))}
          <div><label className="text-xs font-semibold mb-1 block" style={{color:C.blue,fontFamily:font.body}}>Milk</label>
            <Sel value={sel.milk} onChange={e=>setSel(p=>({...p,milk:e.target.value}))} className="w-full"><option value="">— None —</option><option>1% Low-Fat Milk</option></Sel></div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5" style={{borderWidth:2,borderColor:allPass?C.green:`${C.yellow}`,backgroundColor:allPass?`${C.green}08`:`${C.yellow}15`}}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={24} fill={allPass?C.green:"#f59e0b"} color="#fff"/>
              <h3 className="font-bold text-lg" style={{fontFamily:font.header,color:C.slate}}>{allPass?"Meal Pattern Compliant":"Compliance Issues Found"}</h3>
            </div>
            <div className="space-y-2">
              {checks.map((c,i)=>(
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/80">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor:c.pass?C.green:"#dc2626"}}>{c.pass?"✓":"✗"}</span>
                    <span className="text-sm font-semibold" style={{fontFamily:font.body,color:C.slate}}>{c.label}</span>
                  </div>
                  <span className="text-sm" style={{fontFamily:font.body,color:`${C.slate}88`}}>{c.note}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm mb-3" style={{fontFamily:font.header,color:C.blue}}>Meal Totals</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[{l:"Calories",v:totals.calories},{l:"Sodium",v:`${totals.sodium}mg`},{l:"Sat. Fat",v:`${totals.saturatedFat.toFixed(1)}g`},{l:"Total Fat",v:`${totals.totalFat.toFixed(1)}g`}].map(({l,v})=>(
                <div key={l} className="rounded-lg p-3" style={{backgroundColor:C.lightBlue}}>
                  <div className="text-xl font-bold" style={{color:C.green,fontFamily:font.header}}>{v}</div>
                  <div className="text-xs" style={{color:`${C.slate}88`,fontFamily:font.body}}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 4. Menu Planner
const MenuPlannerView = ({recipes,menu,setMenu}) => {
  const byC=useMemo(()=>{const m={};recipes.forEach(r=>{if(!m[r.category])m[r.category]=[];m[r.category].push(r)});m["Milk"]=[MILK_ITEM];return m},[recipes]);
  const getNutr=(day,comps)=>{const t={calories:0,sodium:0,saturatedFat:0};comps.forEach(comp=>{const nm=menu[`${day}-${comp.key}`];if(!nm)return;const r=comp.cat==="Milk"?MILK_ITEM:recipes.find(x=>x.name===nm);if(r){t.calories+=r.nutrition.calories;t.sodium+=r.nutrition.sodium;t.saturatedFat+=r.nutrition.saturatedFat}});return t};
  const getDayTot=d=>{const b=getNutr(d,BK_COMPS),l=getNutr(d,LN_COMPS);return{calories:b.calories+l.calories,sodium:b.sodium+l.sodium,saturatedFat:b.saturatedFat+l.saturatedFat}};

  const MealBlock=({label,emoji,comps})=>(
    <>
      <tr><td colSpan={DAYS.length+1} className="px-3 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-bold text-base" style={{fontFamily:font.header,color:C.slate}}>{label}</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{backgroundColor:C.green}}>{comps.length} components</span>
        </div>
      </td></tr>
      {comps.map(comp=>(
        <tr key={comp.key} style={{borderTop:`1px solid ${C.slate}10`}}>
          <td className="p-2 pl-3 w-40"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:comp.color}}/><span className="text-sm font-semibold" style={{fontFamily:font.body,color:C.slate}}>{comp.label}</span></div></td>
          {DAYS.map(day=>{
            const k=`${day}-${comp.key}`,val=menu[k]||"",opts=byC[comp.cat]||[];
            return(<td key={day} className="p-1.5" style={{borderLeft:`1px solid ${C.slate}08`}}>
              <Sel value={val} onChange={e=>setMenu(p=>({...p,[k]:e.target.value}))} className="w-full text-xs h-8"
                style={val?{borderColor:comp.color,borderWidth:2,backgroundColor:`${comp.color}08`}:{}}>
                <option value="">—</option>{opts.map(r=><option key={r.id||r.name} value={r.name}>{r.name}</option>)}
              </Sel>
            </td>);
          })}
        </tr>
      ))}
      <tr style={{borderTop:`2px solid ${C.green}30`}}>
        <td className="p-2 pl-3 text-sm font-bold" style={{backgroundColor:`${C.green}08`,fontFamily:font.body,color:C.green}}>{label} Total</td>
        {DAYS.map(day=>{const n=getNutr(day,comps);return(
          <td key={day} className="p-1.5 text-center" style={{borderLeft:`1px solid ${C.slate}08`,backgroundColor:`${C.green}08`}}>
            {n.calories>0?(<div className="text-xs space-y-0.5" style={{fontFamily:font.body}}><div className="font-bold" style={{color:C.green}}>{n.calories} cal</div><div style={{color:`${C.slate}77`}}>Na: {n.sodium}mg</div></div>):<span className="text-xs" style={{color:`${C.slate}33`}}>—</span>}
          </td>
        )})}
      </tr>
    </>
  );

  return (
    <div>
      <SectionHeader icon={CalendarDays}>Weekly Menu Planner</SectionHeader>
      <p className="text-sm mb-5" style={{fontFamily:font.body,color:`${C.slate}88`}}>Assign recipes to breakfast (4 components) and lunch (5 components) for each day</p>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[850px]" style={{fontFamily:font.body}}>
          <thead><tr style={{borderBottom:`3px solid ${C.blue}`}}>
            <th className="p-3 text-left font-bold text-sm w-40" style={{fontFamily:font.header,color:C.blue}}>Component</th>
            {DAYS.map(d=>(<th key={d} className="p-3 text-center min-w-[140px]" style={{color:C.blue,fontFamily:font.header}}>
              <span className="block text-xs uppercase tracking-wider font-semibold" style={{color:`${C.blue}77`}}>{d.slice(0,3)}</span><span className="font-bold">{d}</span>
            </th>))}
          </tr></thead>
          <tbody>
            <MealBlock label="Breakfast" emoji="🌅" comps={BK_COMPS}/>
            <MealBlock label="Lunch" emoji="☀️" comps={LN_COMPS}/>
            <tr style={{borderTop:`4px solid ${C.green}`}}>
              <td className="p-3 font-black" style={{backgroundColor:`${C.green}15`,fontFamily:font.header,color:C.green}}>
                <div className="flex items-center gap-1.5"><BarChart3 size={16} fill={C.green}/> Daily Total</div>
              </td>
              {DAYS.map(day=>{const t=getDayTot(day);return(
                <td key={day} className="p-2 text-center" style={{borderLeft:`1px solid ${C.slate}08`,backgroundColor:`${C.green}15`}}>
                  {t.calories>0?(<div className="space-y-0.5"><div className="text-sm font-black" style={{color:C.green,fontFamily:font.header}}>{t.calories} cal</div><div className="text-xs" style={{color:`${C.slate}77`}}>Na: {t.sodium}mg</div><div className="text-xs" style={{color:`${C.slate}77`}}>SF: {t.saturatedFat.toFixed(1)}g</div></div>):<span className="text-xs" style={{color:`${C.slate}33`}}>—</span>}
                </td>
              )})}
            </tr>
          </tbody>
        </table>
      </Card>
      <div className="mt-4 flex flex-wrap gap-4">
        {[...BK_COMPS,...LN_COMPS].filter((c,i,a)=>a.findIndex(x=>x.cat===c.cat)===i).map(comp=>(
          <div key={comp.cat} className="flex items-center gap-1.5 text-xs" style={{color:`${C.slate}88`,fontFamily:font.body}}>
            <span className="w-3 h-3 rounded-full" style={{backgroundColor:comp.color}}/>{comp.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Reports
const ReportsView = ({recipes,menu}) => {
  const wd=useMemo(()=>DAYS.map(day=>{let cal=0,sod=0,sf=0,cnt=0;ALL_COMPS.forEach(comp=>{const nm=menu[`${day}-${comp.key}`];let r;if(comp.cat==="Milk"&&nm)r=MILK_ITEM;else r=recipes.find(x=>x.name===nm);if(r){cal+=r.nutrition.calories;sod+=r.nutrition.sodium;sf+=r.nutrition.saturatedFat;cnt++}});return{day:day.slice(0,3),calories:cal,sodium:sod,saturatedFat:sf,count:cnt}}),[recipes,menu]);
  const avg=fn=>{const f=wd.filter(d=>d.count>0);return f.length?fn(f):0};
  const aC=Math.round(avg(f=>f.reduce((s,d)=>s+d.calories,0)/f.length));
  const aS=Math.round(avg(f=>f.reduce((s,d)=>s+d.sodium,0)/f.length));
  const aSF=avg(f=>(f.reduce((s,d)=>s+d.saturatedFat,0)/f.length).toFixed(1));

  return (
    <div>
      <SectionHeader icon={BarChart3}>Weekly Reports</SectionHeader>
      <p className="text-sm mb-6" style={{fontFamily:font.body,color:`${C.slate}88`}}>Nutrition analysis across your planned menus</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[{l:"Avg Daily Calories",v:aC||"—",lim:"USDA: 550-850",ok:aC===0||(aC>=550&&aC<=850)},{l:"Avg Daily Sodium",v:aS?`${aS}mg`:"—",lim:"USDA: ≤1230mg",ok:aS===0||aS<=1230},{l:"Avg Sat. Fat",v:aSF?`${aSF}g`:"—",lim:"USDA: <10% cal",ok:true}].map(({l,v,lim,ok})=>(
          <Card key={l} className="p-5">
            <div className="text-xs font-semibold mb-1" style={{color:`${C.slate}88`,fontFamily:font.body}}>{l}</div>
            <div className="text-3xl font-black" style={{color:C.green,fontFamily:font.header}}>{v}</div>
            <Badge color={ok?C.green:"#dc2626"}>{lim}</Badge>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[{title:"Daily Calories",field:"calories",maxRef:850,limV:850,limL:"Max 850"},{title:"Daily Sodium (mg)",field:"sodium",maxRef:1420,limV:1230,limL:"Limit 1230mg"}].map(({title,field,maxRef,limV,limL})=>(
          <Card key={title} className="p-5">
            <h3 className="font-bold mb-4" style={{fontFamily:font.header,color:C.blue}}>{title}</h3>
            <div className="space-y-3">
              {wd.map(d=>{const v=d[field];const over=field==="calories"?v>850:v>1230;const under=field==="calories"&&v>0&&v<550;return(
                <div key={d.day} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-semibold" style={{fontFamily:font.body,color:C.slate}}>{d.day}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{backgroundColor:C.lightBlue}}>
                    <div className="h-full rounded-lg transition-all" style={{width:`${Math.min((v/maxRef)*100,100)}%`,backgroundColor:over?'#dc2626':under?C.yellow:C.green}}/>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{color:C.slate,fontFamily:font.body}}>{v||"—"}</span>
                  </div>
                </div>
              )})}
              <div className="flex items-center gap-1 mt-2 text-xs" style={{color:`${C.slate}66`,fontFamily:font.body}}>
                <span className="border-t-2 border-dashed w-6" style={{borderColor:"#dc2626"}}/> {limL}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── NAV ───
const NAV=[
  {key:"book",label:"Recipe Book",Icon:BookOpen},
  {key:"builder",label:"Recipe Builder",Icon:ChefHat},
  {key:"checker",label:"Meal Pattern",Icon:CheckCircle},
  {key:"planner",label:"Menu Planner",Icon:CalendarDays},
  {key:"reports",label:"Reports",Icon:BarChart3},
];

// ─── App ───
export default function App(){
  const [view,setView]=useState("book");
  const [recipes,setRecipes]=useState(INITIAL_RECIPES);
  const [menu,setMenu]=useState({});
  const [viewRecipe,setViewRecipe]=useState(null);
  const [editRecipe,setEditRecipe]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const mainRef=useRef(null);

  const handleSave=r=>{setRecipes(p=>{const e=p.find(x=>x.id===r.id);return e?p.map(x=>x.id===r.id?r:x):[...p,r]});setEditRecipe(null);setView("book")};
  const handleReset=()=>{setMenu({});setRecipes(INITIAL_RECIPES)};
  const handlePrint=()=>window.print();
  const handleSaveFile=()=>{
    const data=JSON.stringify({recipes,menu},null,2);
    const blob=new Blob([data],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="sproutcnp-data.json";a.click();URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{backgroundColor:"#f8f9fa",fontFamily:font.body}}>
      <HeaderBar onReset={handleReset} onPrint={handlePrint} onSave={handleSaveFile}/>
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen&&<div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col transform transition-transform lg:transform-none ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`} style={{backgroundColor:C.slate}}>
          <div className="p-5 border-b" style={{borderColor:"rgba(255,255,255,0.1)"}}>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-black tracking-tight" style={{fontFamily:font.header,fontWeight:900,color:C.green}}>
                Sprou<span className="relative">t<span className="absolute -top-0.5 -right-0.5" style={{color:C.green,fontSize:8}}>🌿</span></span>
              </span>
              <span className="text-lg font-black tracking-tight" style={{fontFamily:font.header,fontWeight:900,color:C.lightBlue}}>CNP</span>
            </div>
            <div className="text-center mt-1 text-xs font-medium tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)",fontFamily:font.body}}>Menu Manager</div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(({key,label,Icon})=>{
              const active = view===key;
              return (
                <button key={key} onClick={()=>{setView(key);setEditRecipe(null);setSidebarOpen(false)}}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={active
                    ? {backgroundColor:C.green, color:"#fff", fontFamily:font.body}
                    : {backgroundColor:"transparent", color:"rgba(255,255,255,0.65)", fontFamily:font.body}
                  }>
                  <Icon size={18} fill={active?"#fff":"none"} color={active?"#fff":"rgba(255,255,255,0.5)"}/>
                  {label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{backgroundColor:C.yellow}}/>}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t" style={{borderColor:"rgba(255,255,255,0.1)"}}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf size={14} color={C.green} fill={C.green}/>
              <span className="text-xs font-semibold" style={{color:C.green,fontFamily:font.body}}>USDA Compliant</span>
            </div>
            <div className="text-xs text-center" style={{color:"rgba(255,255,255,0.3)",fontFamily:font.body}}>v1.0 · © 2026 SproutCNP</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto" ref={mainRef}>
          <div className="lg:hidden p-3 border-b bg-white sticky top-0 z-20" style={{borderColor:`${C.slate}12`}}>
            <button onClick={()=>setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100" style={{color:C.slate}}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {view==="book"&&<RecipeBookView recipes={recipes} onView={r=>setViewRecipe(r)}/>}
            {view==="builder"&&<RecipeBuilderView onSave={handleSave} editRecipe={editRecipe}/>}
            {view==="checker"&&<MealPatternView recipes={recipes}/>}
            {view==="planner"&&<MenuPlannerView recipes={recipes} menu={menu} setMenu={setMenu}/>}
            {view==="reports"&&<ReportsView recipes={recipes} menu={menu}/>}
          </div>
        </main>
      </div>

      <Dialog open={!!viewRecipe} onClose={()=>setViewRecipe(null)} title={viewRecipe?.name||""}>
        {viewRecipe&&(
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge color={C.blue}>{viewRecipe.category}</Badge>
                <span className="text-sm" style={{color:`${C.slate}88`,fontFamily:font.body}}>Yield: {viewRecipe.yield} | {viewRecipe.servingSize}</span>
              </div>
              <h4 className="font-bold text-sm mb-2" style={{fontFamily:font.header,color:C.blue}}>Ingredients</h4>
              <div className="space-y-1">
                {viewRecipe.ingredients.map((ing,i)=>(
                  <div key={i} className="text-sm py-1 border-b" style={{fontFamily:font.body,color:C.slate,borderColor:`${C.slate}10`}}>{ing.qty} {ing.unit} — {ing.name}</div>
                ))}
              </div>
              <Btn variant="outline" className="mt-4" icon={Edit} onClick={()=>{setEditRecipe(viewRecipe);setViewRecipe(null);setView("builder")}}>Edit Recipe</Btn>
            </div>
            <NutritionLabel nutrition={viewRecipe.nutrition} servingSize={viewRecipe.servingSize}/>
          </div>
        )}
      </Dialog>
    </div>
  );
}

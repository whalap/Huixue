# -*- coding: utf-8 -*-
"""Generate data.js : 广州中考E听说 分级题库 (每题型 50+, A1/A2/B1).
v2：修复语义搭配（动词-宾语成对、年龄用AGE、代词按姓名性别、冠词、活动与日期匹配）。"""
import json, random

random.seed(20261023)

# ===================== 词库 =====================
MALE = ["Tom","Ben","Sam","Jack","Joe","Leo","Dan","Peter"]
FEMALE = ["Lucy","Lily","Amy","May","Ann","Rose","Cathy","Kim"]
NAMES = MALE + FEMALE
COLORS = ["red","blue","green","yellow","black","white","pink","brown","orange","purple"]
FRUITS = ["apples","bananas","oranges","pears","mangoes","grapes"]
NOUN_S = ["book","cat","dog","bag","ball","desk","cup","box","bed","hat","key","toy"]
SURFACE = ["desk","table","chair","bed","floor","box"]
PLACE = ["school","park","zoo","library","shop","farm","beach","garden","museum","market"]
VERB_BASE = ["swim","run","walk","sing","draw","read","dance","cook"]
GAME = ["football","basketball","tennis","cards","games","chess"]
SPORT = ["football","basketball","tennis","swimming","running","table tennis"]
ANIMALS = ["dog","cat","rabbit","fish","bird","turtle","hamster","duck","horse","sheep"]
TRANSPORT = ["bus","bike","train","car","subway","boat","taxi"]
TIME = ["seven","eight","nine","ten","eleven","half past seven","a quarter to nine"]
AGE = ["seven","eight","nine","ten","eleven","twelve","thirteen"]
REL = ["grandma","grandpa","aunt","uncle","cousin","friend"]
FAMILY = ["father","mother","brother","sister","grandma","grandpa","uncle","aunt","cousin"]
FOOD2 = ["noodles","rice","bread","dumplings","pizza","fish","chicken","soup"]
MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"]
ACTIVITY = ["read books","play games","draw pictures","sing songs","do homework","clean the room"]
PERSON = ["writer","teacher","scientist","artist","singer"]
EVENT = ["book fair","sports meet","art show","science day","music festival","reading week"]
MORNING_ACT = [["read books","Read books"],["cleaned my room","Cleaned his/her room"],
               ["did my homework","Did his/her homework"],["watched TV","Watched TV"],
               ["helped my mother","Helped his/her mother"],["walked in the park","Walked in the park"],
               ["painted a picture","Painted a picture"],["played outside","Played outside"]]
GO_PLACE = ["park","zoo","museum","beach","library","market","shop"]
CAKE_ING = ["eggs","bananas","apples","oranges","pears"]
RT_PLACE = ["school","park","library","zoo","museum","garden","beach"]
PET_PLACE = ["my home","the garden","a small cage","the yard"]
SPORT_PLACE = ["school","park","playground","sports center"]
DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

def pronoun(name):
    return "she" if name in FEMALE else "he"
def pronoun_cap(name):
    return "She" if name in FEMALE else "He"

WEEKDAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
def cap(s):
    """句首大写，并修正星期/月份等专有名词的大小写"""
    out=s[0].upper()+s[1:] if s else s
    for wd in WEEKDAYS:
        out=out.replace(wd, wd.capitalize())
    return out

VOWEL_SOUND_EXC = {"hour","honest","honor","heir"}  # h 不发音的特例
def art(word):
    """按发音而非字母选择冠词：an art show / a book fair / an hour"""
    w=word.split()[0].lower() if word else ""
    if w in VOWEL_SOUND_EXC: return "an"
    return "an" if w[:1] in "aeiou" else "a"
def with_art(word):
    return f"{art(word)} {word}"

def uniq_pick(pool, n, avoid=()):
    out=[]; i=0
    while len(out)<n and i<len(pool)*3:
        c=pool[i%len(pool)]; i+=1
        if c not in out and c not in avoid: out.append(c)
    return out

def opts(correct, pool, k=3):
    others=[p for p in pool if p!=correct]
    random.shuffle(others)
    arr=[correct]+others[:k-1]
    random.shuffle(arr)
    return arr, arr.index(correct)

PET_NAMES = ["Coco","Max","Lucky","Bella","Rex","Toby","Daisy","Mimi"]

# ===================== 模仿朗读 =====================
# 语料改为「分级连贯短文」（对齐中考真题：朗读的永远是短文，不是单句）：
#   A1 2-3 句 / A2 4-5 句 / B1 8-11 句 85-111 词（真题 107 词规格）
# 语料在 ra_texts.py 中人工撰写并逐条校对（语义/主谓/时态/性别指代/去重），本函数只负责编号打包。
from ra_texts import A1_TEXTS, A2_TEXTS, B1_TEXTS
from gen_official import OFFICIAL

def gen_readaloud():
    out={"A1":[],"A2":[],"B1":[]}
    for i,s in enumerate(A1_TEXTS): out["A1"].append({"id":f"ra_a1_{i+1:02d}","text":s})
    for i,s in enumerate(A2_TEXTS): out["A2"].append({"id":f"ra_a2_{i+1:02d}","text":s})
    for i,s in enumerate(B1_TEXTS): out["B1"].append({"id":f"ra_b1_{i+1:02d}","text":s})
    return out

# ===================== 听选信息 =====================
def gen_listenchoose():
    out={"A1":[],"A2":[],"B1":[]}
    # ===================== 扩充词库 =====================
    DRINK=["water","milk","juice","tea","coffee","cola"]
    SUBJECT=["Chinese","maths","English","science","art","music","PE","history","geography"]
    SCHOOL_THING=["a red book","a blue bag","a yellow pencil","a green ruler","a white eraser","a black pen"]
    COUNT_NOUN=["pencils","books","apples","bananas","cats","dogs","bags","toys","cups","eggs"]
    NUMBERS=["three","five","eight","ten","twelve","fifteen","twenty"]
    HOBBY=["drawing pictures","reading books","playing football","singing songs","swimming","dancing","riding a bike","flying a kite"]
    WEATHER=["sunny","rainy","windy","snowy","cloudy","hot","cold"]
    WEATHER_ACT={"sunny":["play outside","go to the park","ride a bike"],
                 "rainy":["read books","watch TV","do homework"],
                 "windy":["fly a kite","stay at home"],
                 "snowy":["make a snowman","play in the snow"],
                 "cloudy":["walk in the garden","ride a bike"],
                 "hot":["go swimming","eat ice cream"],
                 "cold":["wear a coat","drink hot tea"]}
    GIFT=["a toy car","a story book","a blue pen","a red bag","a football","a doll","a kite","a model plane"]
    FAMILY=["father","mother","brother","sister","grandma","grandpa","uncle","aunt","cousin"]
    CLASSROOM=["near the window","behind the door","next to the blackboard","in the front row","at the back"]
    FOOD2=["noodles","rice","bread","dumplings","pizza","fish","chicken","soup"]
    PLACE2=["the park","the zoo","the library","the shop","the farm","the beach","the museum","the market","the cinema","the garden"]
    WEEK=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    MONTH=["January","February","March","April","May","June","July","August","September","October","November","December"]
    TRANSPORT2=TRANSPORT
    ACT3=["play basketball","watch a film","read a book","visit my grandma","go swimming","clean my room","help my mother","ride a bike"]
    LOSE_PLACE=["in the classroom","on the bus","in the library","at the park","in the dining hall","on the playground"]
    FINDER=["his teacher","a classmate","the cleaner","a kind girl","the bus driver","his brother"]
    B1_WHY=["keep healthy","save money","protect the earth","make new friends","learn new things","help others","have fun"]
    B1_HOWOFTEN=["once a week","twice a month","every day","three times a year","twice a week","once a month"]
    B1_WHERE=["the library","the park","the museum","the sports center","the old people's home","the community center"]
    B1_WHO=["my classmates","my teacher","some volunteers","my family","the school band"]
    B1_WHEN=["next Saturday","this Friday","next month","during the holiday","next week","this weekend"]
    B1_PLAN=["plant more trees","clean the river","start a reading club","help old people","collect used books","visit the sick children"]
    B1_CAREER=["a teacher","a scientist","a doctor","an artist","a writer","a pilot","an engineer"]
    B1_APP=["a study app","a reading app","a drawing app","a music app","a map app"]
    B1_HABIT=["run in the morning","eat more fruit","drink more water","read before sleep","walk to school"]
    B1_ENV=["plant trees","save water","ride a bike","reuse paper","pick up litter"]

    # ===================== A1 场景（一般现在时 / 日常生活） =====================
    def a1_fruit():
        n=random.choice(NAMES); f1,f2=uniq_pick(FRUITS,2); c=random.choice(COLORS)
        c2,c3=uniq_pick(COLORS,2,avoid=(c,)); age=random.choice(AGE); a2,a3=uniq_pick(AGE,2,avoid=(age,))
        dlg=[{"s":"A","t":f"Hi {n}, do you like {f1}?"},{"s":"B","t":f"No, I like {f2}."},
             {"s":"A","t":"What color is your bag?"},{"s":"B","t":f"It is {c}."},
             {"s":"A","t":"How old are you?"},{"s":"B","t":f"I am {age} years old."}]
        o1,an1=opts(f2,FRUITS);o2,an2=opts(c,COLORS);o3,an3=opts(age,AGE)
        return dlg,[{"q":f"What fruit does {n} like?","opts":o1,"ans":an1},
                    {"q":f"What color is {n}'s bag?","opts":o2,"ans":an2},
                    {"q":f"How old is {n}?","opts":o3,"ans":an3}]
    def a1_pet():
        n=random.choice(NAMES); an=random.choice(ANIMALS); c=random.choice(COLORS); p=random.choice(PET_PLACE)
        dlg=[{"s":"A","t":f"Hello {n}, do you have a pet?"},{"s":"B","t":f"Yes, I have a {an}."},
             {"s":"A","t":"What color is it?"},{"s":"B","t":f"It is {c}."},
             {"s":"A","t":"Where does it live?"},{"s":"B","t":f"It lives in {p}."}]
        o1,an1=opts(an,ANIMALS);o2,an2=opts(c,COLORS);o3,an3=opts(p,PET_PLACE)
        return dlg,[{"q":f"What pet does {n} have?","opts":o1,"ans":an1},
                    {"q":"What color is the pet?","opts":o2,"ans":an2},
                    {"q":"Where does it live?","opts":o3,"ans":an3}]
    def a1_sport():
        n=random.choice(NAMES); sp=random.choice(SPORT); d=random.choice(DAYS); p=random.choice(SPORT_PLACE)
        dlg=[{"s":"A","t":f"{n}, what sport do you like?"},{"s":"B","t":f"I like {sp}."},
             {"s":"A","t":"Which day do you play it?"},{"s":"B","t":f"I play on {d}."},
             {"s":"A","t":"Where do you play?"},{"s":"B","t":f"We play at {p}."}]
        o1,an1=opts(sp,SPORT);o2,an2=opts(d,DAYS);o3,an3=opts(p,SPORT_PLACE)
        return dlg,[{"q":f"What sport does {n} like?","opts":o1,"ans":an1},
                    {"q":f"Which day does {n} play it?","opts":o2,"ans":an2},
                    {"q":f"Where does {n} play?","opts":o3,"ans":an3}]
    def a1_food_drink():
        n=random.choice(NAMES); food=random.choice(FOOD2); dr=random.choice(DRINK)
        when=random.choice(["in the morning","at noon","in the evening","after school"])
        dlg=[{"s":"A","t":f"Hi {n}, what do you like to eat?"},{"s":"B","t":f"I like {food}."},
             {"s":"A","t":"What do you like to drink?"},{"s":"B","t":f"I like {dr}."},
             {"s":"A","t":f"When do you usually eat {food}?"},{"s":"B","t":f"I eat it {when}."}]
        o1,an1=opts(food,FOOD2);o2,an2=opts(dr,DRINK);o3,an3=opts(when,["in the morning","at noon","in the evening","after school"])
        return dlg,[{"q":f"What food does {n} like?","opts":o1,"ans":an1},
                    {"q":f"What drink does {n} like?","opts":o2,"ans":an2},
                    {"q":f"When does {n} eat {food}?","opts":o3,"ans":an3}]
    def a1_school_thing():
        n=random.choice(NAMES); th=random.choice(SCHOOL_THING); c=random.choice(COLORS); where=random.choice(CLASSROOM)
        dlg=[{"s":"A","t":f"{n}, what is in your schoolbag?"},{"s":"B","t":f"I have {th}."},
             {"s":"A","t":"What color is it?"},{"s":"B","t":f"It is {c}."},
             {"s":"A","t":"Where do you sit in class?"},{"s":"B","t":f"I sit {where}."}]
        o1,an1=opts(th,SCHOOL_THING);o2,an2=opts(c,COLORS);o3,an3=opts(where,CLASSROOM)
        return dlg,[{"q":f"What does {n} have in the schoolbag?","opts":o1,"ans":an1},
                    {"q":"What color is it?","opts":o2,"ans":an2},
                    {"q":f"Where does {n} sit?","opts":o3,"ans":an3}]
    def a1_transport():
        n=random.choice(NAMES); tr=random.choice(TRANSPORT2); t=random.choice(TIME); who=random.choice(FAMILY)
        dlg=[{"s":"A","t":f"{n}, how do you go to school?"},{"s":"B","t":f"I go by {tr}."},
             {"s":"A","t":"What time do you leave home?"},{"s":"B","t":f"I leave at {t}."},
             {"s":"A","t":"Who goes with you?"},{"s":"B","t":f"I go with my {who}."}]
        o1,an1=opts(tr,TRANSPORT2);o2,an2=opts(t,TIME);o3,an3=opts(who,FAMILY)
        return dlg,[{"q":f"How does {n} go to school?","opts":o1,"ans":an1},
                    {"q":f"What time does {n} leave home?","opts":o2,"ans":an2},
                    {"q":f"Who goes with {n}?","opts":o3,"ans":an3}]
    def a1_family():
        n=random.choice(NAMES); num=random.choice(NUMBERS); pet=random.choice(ANIMALS); hobby=random.choice(HOBBY)
        dlg=[{"s":"A","t":f"Hi {n}, how many people are in your family?"},{"s":"B","t":f"There are {num}."},
             {"s":"A","t":"Do you have a pet?"},{"s":"B","t":f"Yes, a {pet}."},
             {"s":"A","t":"What do you like doing with your family?"},{"s":"B","t":f"We like {hobby}."}]
        o1,an1=opts(num,NUMBERS);o2,an2=opts(pet,ANIMALS);o3,an3=opts(hobby,HOBBY)
        return dlg,[{"q":f"How many people are in {n}'s family?","opts":o1,"ans":an1},
                    {"q":f"What pet does {n} have?","opts":o2,"ans":an2},
                    {"q":f"What does {n}'s family like doing?","opts":o3,"ans":an3}]
    def a1_hobby():
        n=random.choice(NAMES); h1=random.choice(HOBBY); p=random.choice(PLACE2); who=random.choice(FAMILY)
        dlg=[{"s":"A","t":f"{n}, what is your hobby?"},{"s":"B","t":f"I like {h1}."},
             {"s":"A","t":"Where do you do it?"},{"s":"B","t":f"I do it {p}."},
             {"s":"A","t":"Who do you do it with?"},{"s":"B","t":f"With my {who}."}]
        o1,an1=opts(h1,HOBBY);o2,an2=opts(p,PLACE2);o3,an3=opts(who,FAMILY)
        return dlg,[{"q":f"What is {n}'s hobby?","opts":o1,"ans":an1},
                    {"q":f"Where does {n} do it?","opts":o2,"ans":an2},
                    {"q":f"Who does {n} do it with?","opts":o3,"ans":an3}]
    def a1_weather():
        n=random.choice(NAMES); w=random.choice(WEATHER); act=random.choice(WEATHER_ACT[w]); feel=random.choice(["happy","tired","excited","warm"])
        dlg=[{"s":"A","t":f"{n}, what is the weather like today?"},{"s":"B","t":f"It is {w}."},
             {"s":"A","t":"What do you do on such a day?"},{"s":"B","t":f"I {act}."},
             {"s":"A","t":"How do you feel?"},{"s":"B","t":f"I feel {feel}."}]
        o1,an1=opts(w,WEATHER);o2,an2=opts(act,WEATHER_ACT[w]);o3,an3=opts(feel,["happy","tired","excited","warm"])
        return dlg,[{"q":"What is the weather like?","opts":o1,"ans":an1},
                    {"q":f"What does {n} do?","opts":o2,"ans":an2},
                    {"q":f"How does {n} feel?","opts":o3,"ans":an3}]
    def a1_birthday():
        n=random.choice(NAMES); g=random.choice(GIFT); m=random.choice(MONTH); c=random.choice(COLORS)
        dlg=[{"s":"A","t":f"{n}, when is your birthday?"},{"s":"B","t":f"It is in {m}."},
             {"s":"A","t":"What gift do you want?"},{"s":"B","t":f"I want {g}."},
             {"s":"A","t":"What color do you like?"},{"s":"B","t":f"I like {c}."}]
        o1,an1=opts(m,MONTH);o2,an2=opts(g,GIFT);o3,an3=opts(c,COLORS)
        return dlg,[{"q":f"When is {n}'s birthday?","opts":o1,"ans":an1},
                    {"q":f"What gift does {n} want?","opts":o2,"ans":an2},
                    {"q":f"What color does {n} like?","opts":o3,"ans":an3}]
    def a1_classroom():
        n=random.choice(NAMES); c=random.choice(COLORS); where=random.choice(CLASSROOM); subj=random.choice(SUBJECT)
        dlg=[{"s":"A","t":f"{n}, what color is your desk?"},{"s":"B","t":f"It is {c}."},
             {"s":"A","t":"Where do you sit?"},{"s":"B","t":f"I sit {where}."},
             {"s":"A","t":"What is your favorite subject?"},{"s":"B","t":f"I like {subj}."}]
        o1,an1=opts(c,COLORS);o2,an2=opts(where,CLASSROOM);o3,an3=opts(subj,SUBJECT)
        return dlg,[{"q":f"What color is {n}'s desk?","opts":o1,"ans":an1},
                    {"q":f"Where does {n} sit?","opts":o2,"ans":an2},
                    {"q":f"What is {n}'s favorite subject?","opts":o3,"ans":an3}]
    def a1_count():
        n=random.choice(NAMES); cn=random.choice(COUNT_NOUN); num=random.choice(NUMBERS); c=random.choice(COLORS)
        dlg=[{"s":"A","t":f"{n}, how many {cn} do you have?"},{"s":"B","t":f"I have {num}."},
             {"s":"A","t":"What color are they?"},{"s":"B","t":f"They are {c}."},
             {"s":"A","t":"Where are they?"},{"s":"B","t":"They are in my schoolbag."}]
        o1,an1=opts(num,NUMBERS);o2,an2=opts(c,COLORS);o3,an3=opts("in my schoolbag",["in my schoolbag","on the desk","in the box"])
        return dlg,[{"q":f"How many {cn} does {n} have?","opts":o1,"ans":an1},
                    {"q":"What color are they?","opts":o2,"ans":an2},
                    {"q":"Where are they?","opts":o3,"ans":an3}]

    # ===================== A2 场景（一般过去时 / 经历） =====================
    def a2_trip():
        n=random.choice(NAMES); p=random.choice(GO_PLACE); rel=random.choice(REL); tr=random.choice(TRANSPORT); t=random.choice(TIME)
        dlg=[{"s":"A","t":f"{n}, what did you do last weekend?"},{"s":"B","t":f"I went to the {p} with my {rel}."},
             {"s":"A","t":"How did you get there?"},{"s":"B","t":f"We took a {tr}."},
             {"s":"A","t":"What time did you come back?"},{"s":"B","t":f"We got home at {t}."}]
        o1,an1=opts(p,GO_PLACE);o2,an2=opts(tr,TRANSPORT);o3,an3=opts(t,TIME)
        return dlg,[{"q":f"Where did {n} go last weekend?","opts":o1,"ans":an1},
                    {"q":"How did they get there?","opts":o2,"ans":an2},
                    {"q":"When did they get home?","opts":o3,"ans":an3}]
    def a2_yesterday():
        n=random.choice(NAMES); act,act_key=MORNING_ACT[random.randrange(len(MORNING_ACT))]
        rel=random.choice(REL); food=random.choice(FRUITS)
        dlg=[{"s":"A","t":f"{n}, what did you do yesterday?"},{"s":"B","t":f"I {act} in the morning."},
             {"s":"A","t":"Who did you visit?"},{"s":"B","t":f"I visited my {rel}."},
             {"s":"A","t":"What did you eat together?"},{"s":"B","t":f"We ate {food}."}]
        acts=[a for a,_ in MORNING_ACT]
        o1,an1=opts(act,acts);o2,an2=opts(rel,REL);o3,an3=opts(food,FRUITS)
        return dlg,[{"q":f"What did {n} do in the morning?","opts":o1,"ans":an1},
                    {"q":f"Who did {n} visit?","opts":o2,"ans":an2},
                    {"q":"What did they eat?","opts":o3,"ans":an3}]
    def a2_shop():
        n=random.choice(NAMES); obj=random.choice(["a book","a cake","a toy","some eggs","a pen","a gift"])
        pay=random.choice(["ten yuan","twenty yuan","five yuan","fifteen yuan","thirty yuan","twelve yuan"]); who=random.choice(REL)
        dlg=[{"s":"A","t":f"{n}, what did you buy in the shop?"},{"s":"B","t":f"I bought {obj}."},
             {"s":"A","t":"How much was it?"},{"s":"B","t":f"It was {pay}."},
             {"s":"A","t":"Who did you go with?"},{"s":"B","t":f"I went with my {who}."}]
        objs=["a book","a cake","a toy","some eggs","a pen","a gift"]
        pays=["ten yuan","twenty yuan","five yuan","fifteen yuan","thirty yuan","twelve yuan"]
        o1,an1=opts(obj,objs);o2,an2=opts(pay,pays);o3,an3=opts(who,REL)
        return dlg,[{"q":f"What did {n} buy?","opts":o1,"ans":an1},
                    {"q":"How much was it?","opts":o2,"ans":an2},
                    {"q":f"Who did {n} go with?","opts":o3,"ans":an3}]
    def a2_birthday():
        n=random.choice(NAMES); g=random.choice(GIFT); who=random.choice(FAMILY); food=random.choice(FOOD2)
        dlg=[{"s":"A","t":f"{n}, did you have a birthday party?"},{"s":"B","t":f"Yes, I got {g}."},
             {"s":"A","t":"Who came to the party?"},{"s":"B","t":f"My {who} came."},
             {"s":"A","t":"What did you eat?"},{"s":"B","t":f"We ate {food}."}]
        o1,an1=opts(g,GIFT);o2,an2=opts(who,FAMILY);o3,an3=opts(food,FOOD2)
        return dlg,[{"q":f"What gift did {n} get?","opts":o1,"ans":an1},
                    {"q":f"Who came to the party?","opts":o2,"ans":an2},
                    {"q":"What did they eat?","opts":o3,"ans":an3}]
    def a2_lost():
        n=random.choice(NAMES); lost=random.choice(["a red bag","a blue pen","a story book","a black umbrella","a green ruler","a yellow toy"])
        lp=random.choice(LOSE_PLACE); finder=random.choice(FINDER)
        dlg=[{"s":"A","t":f"{n}, you look sad. What happened?"},{"s":"B","t":f"I lost {lost}."},
             {"s":"A","t":"Where did you lose it?"},{"s":"B","t":f"I lost it {lp}."},
             {"s":"A","t":"Who found it for you?"},{"s":"B","t":f"{cap(finder)} found it."}]
        o1,an1=opts(lost,["a red bag","a blue pen","a story book","a black umbrella","a green ruler","a yellow toy"])
        o2,an2=opts(lp,LOSE_PLACE);o3,an3=opts(finder,FINDER)
        return dlg,[{"q":f"What did {n} lose?","opts":o1,"ans":an1},
                    {"q":f"Where did {n} lose it?","opts":o2,"ans":an2},
                    {"q":f"Who found it?","opts":o3,"ans":an3}]
    def a2_help():
        n=random.choice(NAMES); who=random.choice(FAMILY); did=random.choice(["carried heavy bags","cleaned the room","cooked dinner","walked the dog"])
        feel=random.choice(["happy","tired","proud"])
        dlg=[{"s":"A","t":f"{n}, did you help anyone yesterday?"},{"s":"B","t":f"Yes, I helped my {who}."},
             {"s":"A","t":"What did you do?"},{"s":"B","t":f"I {did}."},
             {"s":"A","t":"How did you feel?"},{"s":"B","t":f"I felt {feel}."}]
        o1,an1=opts(who,FAMILY);o2,an2=opts(did,["carried heavy bags","cleaned the room","cooked dinner","walked the dog"]);o3,an3=opts(feel,["happy","tired","proud"])
        return dlg,[{"q":f"Who did {n} help?","opts":o1,"ans":an1},
                    {"q":f"What did {n} do?","opts":o2,"ans":an2},
                    {"q":f"How did {n} feel?","opts":o3,"ans":an3}]
    def a2_weather_day():
        n=random.choice(NAMES); w=random.choice(["sunny","rainy","windy","snowy","cloudy"]); did=random.choice(ACT3); who=random.choice(FAMILY)
        dlg=[{"s":"A","t":f"{n}, what was the weather like yesterday?"},{"s":"B","t":f"It was {w}."},
             {"s":"A","t":"What did you do?"},{"s":"B","t":f"I {did} with my {who}."},
             {"s":"A","t":"Did you have fun?"},{"s":"B","t":"Yes, we did."}]
        o1,an1=opts(w,["sunny","rainy","windy","snowy","cloudy"]);o2,an2=opts(did,ACT3);o3,an3=opts(who,FAMILY)
        return dlg,[{"q":"What was the weather like?","opts":o1,"ans":an1},
                    {"q":f"What did {n} do?","opts":o2,"ans":an2},
                    {"q":f"Who did {n} do it with?","opts":o3,"ans":an3}]
    def a2_film():
        n=random.choice(NAMES); who=random.choice(FAMILY); adj=random.choice(["interesting","boring","exciting","funny"]); place=random.choice(["the cinema","the park","my home"])
        dlg=[{"s":"A","t":f"{n}, did you watch a film?"},{"s":"B","t":f"Yes, with my {who}."},
             {"s":"A","t":"Where did you watch it?"},{"s":"B","t":f"We watched it {place}."},
             {"s":"A","t":"Was it good?"},{"s":"B","t":f"It was {adj}."}]
        o1,an1=opts(who,FAMILY);o2,an2=opts(place,["the cinema","the park","my home"]);o3,an3=opts(adj,["interesting","boring","exciting","funny"])
        return dlg,[{"q":f"Who did {n} watch the film with?","opts":o1,"ans":an1},
                    {"q":"Where did they watch it?","opts":o2,"ans":an2},
                    {"q":"What was the film like?","opts":o3,"ans":an3}]
    def a2_sport_game():
        n=random.choice(NAMES); sp=random.choice(SPORT); win=random.choice(["won","lost","drew"]); place=random.choice(SPORT_PLACE)
        dlg=[{"s":"A","t":f"{n}, did you have a match?"},{"s":"B","t":f"Yes, we played {sp}."},
             {"s":"A","t":"Where did you play?"},{"s":"B","t":f"We played at {place}."},
             {"s":"A","t":"Did you win?"},{"s":"B","t":f"We {win}."}]
        o1,an1=opts(sp,SPORT);o2,an2=opts(place,SPORT_PLACE);o3,an3=opts(win,["won","lost","drew"])
        return dlg,[{"q":f"What sport did {n} play?","opts":o1,"ans":an1},
                    {"q":"Where did they play?","opts":o2,"ans":an2},
                    {"q":"Did they win?","opts":o3,"ans":an3}]
    def a2_cook():
        n=random.choice(NAMES); food=random.choice(FOOD2); who=random.choice(FAMILY); feel=random.choice(["happy","tired","proud"])
        dlg=[{"s":"A","t":f"{n}, what did you cook?"},{"s":"B","t":f"I cooked {food}."},
             {"s":"A","t":"Who did you cook for?"},{"s":"B","t":f"For my {who}."},
             {"s":"A","t":"How did you feel?"},{"s":"B","t":f"I felt {feel}."}]
        o1,an1=opts(food,FOOD2);o2,an2=opts(who,FAMILY);o3,an3=opts(feel,["happy","tired","proud"])
        return dlg,[{"q":f"What did {n} cook?","opts":o1,"ans":an1},
                    {"q":f"Who did {n} cook for?","opts":o2,"ans":an2},
                    {"q":f"How did {n} feel?","opts":o3,"ans":an3}]
    def a2_read():
        n=random.choice(NAMES); book=random.choice(["a story book","a science book","a picture book","a comic"]); where=random.choice(["in the library","at home","in the park"]); like=random.choice(["liked it","loved it","enjoyed it"])
        dlg=[{"s":"A","t":f"{n}, what did you read?"},{"s":"B","t":f"I read {book}."},
             {"s":"A","t":"Where did you read it?"},{"s":"B","t":f"I read it {where}."},
             {"s":"A","t":"Did you like it?"},{"s":"B","t":f"Yes, I {like}."}]
        o1,an1=opts(book,["a story book","a science book","a picture book","a comic"]);o2,an2=opts(where,["in the library","at home","in the park"]);o3,an3=opts(like,["liked it","loved it","enjoyed it"])
        return dlg,[{"q":f"What did {n} read?","opts":o1,"ans":an1},
                    {"q":f"Where did {n} read it?","opts":o2,"ans":an2},
                    {"q":f"Did {n} like it?","opts":o3,"ans":an3}]
    def a2_school_event():
        n=random.choice(NAMES); ev=random.choice(EVENT); did=random.choice(["sang songs","drew pictures","made posters","played games"]); who=random.choice(FAMILY)
        dlg=[{"s":"A","t":f"{n}, was there a school event?"},{"s":"B","t":f"Yes, we had {with_art(ev)}."},
             {"s":"A","t":"What did you do there?"},{"s":"B","t":f"I {did}."},
             {"s":"A","t":"Who came to watch?"},{"s":"B","t":f"My {who} came."}]
        o1,an1=opts(ev,EVENT);o2,an2=opts(did,["sang songs","drew pictures","made posters","played games"]);o3,an3=opts(who,FAMILY)
        return dlg,[{"q":f"What event did {n} have?","opts":o1,"ans":an1},
                    {"q":f"What did {n} do?","opts":o2,"ans":an2},
                    {"q":f"Who came to watch?","opts":o3,"ans":an3}]

    # ===================== B1 场景（将来时 / 原因 / 频率） =====================
    def b1_walk():
        why=random.choice(B1_WHY); dur=random.choice(["about ten minutes","about twenty minutes","about half an hour","about forty minutes"])
        stop=random.choice(["when it rains heavily","on snowy days","if he is ill","during the holidays"])
        dlg=[{"s":"A","t":"Mr. Green, why do you walk to work every day?"},{"s":"B","t":f"Because it helps me {why}."},
             {"s":"A","t":"How long does it take?"},{"s":"B","t":f"About {dur.replace('about ','')} if I walk fast."},
             {"s":"A","t":"When will you stop walking?"},{"s":"B","t":f"{cap(stop)}."}]
        o1,an1=opts(why,B1_WHY);o2,an2=opts(dur,["about ten minutes","about twenty minutes","about half an hour","about forty minutes"]);o3,an3=opts(stop,["when it rains heavily","on snowy days","if he is ill","during the holidays"])
        return dlg,[{"q":"Why does Mr. Green walk to work?","opts":o1,"ans":an1},
                    {"q":"How long does the walk take?","opts":o2,"ans":an2},
                    {"q":"When will he stop walking?","opts":o3,"ans":an3}]
    def b1_club():
        n=random.choice(NAMES); plan=random.choice(B1_PLAN); freq=random.choice(B1_HOWOFTEN); why=random.choice(B1_WHY)
        dlg=[{"s":"A","t":f"{n}, what will your club do next term?"},{"s":"B","t":f"We will {plan}."},
             {"s":"A","t":"How often will you meet?"},{"s":"B","t":f"{cap(freq)}."},
             {"s":"A","t":"Why do you want to do it?"},{"s":"B","t":f"Because {why}."}]
        o1,an1=opts(plan,B1_PLAN);o2,an2=opts(freq,B1_HOWOFTEN);o3,an3=opts(why,B1_WHY)
        return dlg,[{"q":f"What will {n}'s club do?","opts":o1,"ans":an1},
                    {"q":"How often will they meet?","opts":o2,"ans":an2},
                    {"q":"Why do they want to do it?","opts":o3,"ans":an3}]
    def b1_trip():
        n=random.choice(NAMES); where=random.choice(B1_WHERE); who=random.choice(B1_WHO); when=random.choice(B1_WHEN)
        dlg=[{"s":"A","t":f"{n}, where will you go for the trip?"},{"s":"B","t":f"We will go to {where}."},
             {"s":"A","t":"Who will go with you?"},{"s":"B","t":f"{cap(who)}."},
             {"s":"A","t":"When will you leave?"},{"s":"B","t":f"{cap(when)}."}]
        o1,an1=opts(where,B1_WHERE);o2,an2=opts(who,B1_WHO);o3,an3=opts(when,B1_WHEN)
        return dlg,[{"q":f"Where will {n} go?","opts":o1,"ans":an1},
                    {"q":f"Who will go with {n}?","opts":o2,"ans":an2},
                    {"q":"When will they leave?","opts":o3,"ans":an3}]
    def b1_volunteer():
        n=random.choice(NAMES); what=random.choice(["help old people","clean the park","visit sick children","plant trees"]); where=random.choice(B1_WHERE); why=random.choice(B1_WHY)
        dlg=[{"s":"A","t":f"{n}, what will you do as a volunteer?"},{"s":"B","t":f"I will {what}."},
             {"s":"A","t":"Where will you do it?"},{"s":"B","t":f"At {where}."},
             {"s":"A","t":"Why do you do it?"},{"s":"B","t":f"Because I want to {why}."}]
        o1,an1=opts(what,["help old people","clean the park","visit sick children","plant trees"]);o2,an2=opts(where,B1_WHERE);o3,an3=opts(why,B1_WHY)
        return dlg,[{"q":f"What will {n} do?","opts":o1,"ans":an1},
                    {"q":f"Where will {n} do it?","opts":o2,"ans":an2},
                    {"q":f"Why does {n} do it?","opts":o3,"ans":an3}]
    def b1_project():
        n=random.choice(NAMES); what=random.choice(["a science project","a reading project","an art project","a history project"]); who=random.choice(B1_WHO); when=random.choice(B1_WHEN)
        dlg=[{"s":"A","t":f"{n}, what project are you doing?"},{"s":"B","t":f"We are doing {what}."},
             {"s":"A","t":"Who are you working with?"},{"s":"B","t":f"{cap(who)}."},
             {"s":"A","t":"When will you finish?"},{"s":"B","t":f"{cap(when)}."}]
        o1,an1=opts(what,["a science project","a reading project","an art project","a history project"]);o2,an2=opts(who,B1_WHO);o3,an3=opts(when,B1_WHEN)
        return dlg,[{"q":f"What project is {n} doing?","opts":o1,"ans":an1},
                    {"q":f"Who is {n} working with?","opts":o2,"ans":an2},
                    {"q":"When will they finish?","opts":o3,"ans":an3}]
    def b1_health():
        n=random.choice(NAMES); habit=random.choice(B1_HABIT); freq=random.choice(B1_HOWOFTEN); why=random.choice(B1_WHY)
        dlg=[{"s":"A","t":f"{n}, what do you do to keep healthy?"},{"s":"B","t":f"I {habit}."},
             {"s":"A","t":"How often do you do it?"},{"s":"B","t":f"{cap(freq)}."},
             {"s":"A","t":"Why is it good for you?"},{"s":"B","t":f"Because it helps me {why}."}]
        o1,an1=opts(habit,B1_HABIT);o2,an2=opts(freq,B1_HOWOFTEN);o3,an3=opts(why,B1_WHY)
        return dlg,[{"q":f"What does {n} do to keep healthy?","opts":o1,"ans":an1},
                    {"q":f"How often does {n} do it?","opts":o2,"ans":an2},
                    {"q":"Why is it good?","opts":o3,"ans":an3}]
    def b1_study():
        n=random.choice(NAMES); what=random.choice(["read English","practice speaking","listen to tapes","write diaries"]); dur=random.choice(["half an hour","an hour","twenty minutes","forty minutes"]); why=random.choice(B1_WHY)
        dlg=[{"s":"A","t":f"{n}, how do you study English?"},{"s":"B","t":f"I {what} every day."},
             {"s":"A","t":"How long do you study?"},{"s":"B","t":f"For {dur}."},
             {"s":"A","t":"Why do you study hard?"},{"s":"B","t":f"Because I want to {why}."}]
        o1,an1=opts(what,["read English","practice speaking","listen to tapes","write diaries"]);o2,an2=opts(dur,["half an hour","an hour","twenty minutes","forty minutes"]);o3,an3=opts(why,B1_WHY)
        return dlg,[{"q":f"How does {n} study English?","opts":o1,"ans":an1},
                    {"q":f"How long does {n} study?","opts":o2,"ans":an2},
                    {"q":f"Why does {n} study hard?","opts":o3,"ans":an3}]
    def b1_festival():
        n=random.choice(NAMES); what=random.choice(["the Spring Festival","Christmas","the Mid-Autumn Festival","the Dragon Boat Festival"]); who=random.choice(B1_WHO); when=random.choice(B1_WHEN)
        dlg=[{"s":"A","t":f"{n}, how will you spend {what}?"},{"s":"B","t":f"I will stay with {who}."},
             {"s":"A","t":"What will you eat?"},{"s":"B","t":"We will eat special food."},
             {"s":"A","t":"When is it?"},{"s":"B","t":f"{cap(when)}."}]
        o1,an1=opts(what,["the Spring Festival","Christmas","the Mid-Autumn Festival","the Dragon Boat Festival"]);o2,an2=opts(who,B1_WHO);o3,an3=opts(when,B1_WHEN)
        return dlg,[{"q":f"How will {n} spend {what}?","opts":o1,"ans":an1},
                    {"q":f"Who will {n} stay with?","opts":o2,"ans":an2},
                    {"q":"When is it?","opts":o3,"ans":an3}]
    def b1_env():
        n=random.choice(NAMES); what=random.choice(B1_ENV); where=random.choice(B1_WHERE); why=random.choice(["protect the earth","save money","keep the city clean","help animals"])
        dlg=[{"s":"A","t":f"{n}, what do you do for the environment?"},{"s":"B","t":f"I {what}."},
             {"s":"A","t":"Where do you do it?"},{"s":"B","t":f"{cap(where)}."},
             {"s":"A","t":"Why do you do it?"},{"s":"B","t":f"Because I want to {why}."}]
        o1,an1=opts(what,B1_ENV);o2,an2=opts(where,B1_WHERE);o3,an3=opts(why,["protect the earth","save money","keep the city clean","help animals"])
        return dlg,[{"q":f"What does {n} do for the environment?","opts":o1,"ans":an1},
                    {"q":f"Where does {n} do it?","opts":o2,"ans":an2},
                    {"q":f"Why does {n} do it?","opts":o3,"ans":an3}]
    def b1_career():
        n=random.choice(NAMES); career=random.choice(B1_CAREER); why=random.choice(B1_WHY); how=random.choice(["study hard","read more books","practice every day","learn from others"])
        dlg=[{"s":"A","t":f"{n}, what do you want to be?"},{"s":"B","t":f"I want to be {career}."},
             {"s":"A","t":"Why?"},{"s":"B","t":f"Because I want to {why}."},
             {"s":"A","t":"How will you make it?"},{"s":"B","t":f"I will {how}."}]
        o1,an1=opts(career,B1_CAREER);o2,an2=opts(why,B1_WHY);o3,an3=opts(how,["study hard","read more books","practice every day","learn from others"])
        return dlg,[{"q":f"What does {n} want to be?","opts":o1,"ans":an1},
                    {"q":f"Why does {n} want that?","opts":o2,"ans":an2},
                    {"q":f"How will {n} make it?","opts":o3,"ans":an3}]
    def b1_tech():
        n=random.choice(NAMES); app=random.choice(B1_APP); freq=random.choice(B1_HOWOFTEN); why=random.choice(["learn faster","have fun","read more","practice speaking"])
        dlg=[{"s":"A","t":f"{n}, what app do you often use?"},{"s":"B","t":f"I often use {app}."},
             {"s":"A","t":"How often do you use it?"},{"s":"B","t":f"{cap(freq)}."},
             {"s":"A","t":"Why do you like it?"},{"s":"B","t":f"Because it helps me {why}."}]
        o1,an1=opts(app,B1_APP);o2,an2=opts(freq,B1_HOWOFTEN);o3,an3=opts(why,["learn faster","have fun","read more","practice speaking"])
        return dlg,[{"q":f"What app does {n} often use?","opts":o1,"ans":an1},
                    {"q":f"How often does {n} use it?","opts":o2,"ans":an2},
                    {"q":f"Why does {n} like it?","opts":o3,"ans":an3}]
    def b1_family_plan():
        n=random.choice(NAMES); where=random.choice(["the beach","the mountains","a big city","the countryside"]); when=random.choice(B1_WHEN); who=random.choice(B1_WHO)
        dlg=[{"s":"A","t":f"{n}, where will your family go on holiday?"},{"s":"B","t":f"We will go to {where}."},
             {"s":"A","t":"When will you go?"},{"s":"B","t":f"{cap(when)}."},
             {"s":"A","t":"Who will go with you?"},{"s":"B","t":f"{cap(who)}."}]
        o1,an1=opts(where,["the beach","the mountains","a big city","the countryside"]);o2,an2=opts(when,B1_WHEN);o3,an3=opts(who,B1_WHO)
        return dlg,[{"q":f"Where will {n}'s family go?","opts":o1,"ans":an1},
                    {"q":"When will they go?","opts":o2,"ans":an2},
                    {"q":f"Who will go with {n}?","opts":o3,"ans":an3}]

    A1_SCEN=[a1_fruit,a1_pet,a1_sport,a1_food_drink,a1_school_thing,a1_transport,
             a1_family,a1_hobby,a1_weather,a1_birthday,a1_classroom,a1_count]
    A2_SCEN=[a2_trip,a2_yesterday,a2_shop,a2_birthday,a2_lost,a2_help,
             a2_weather_day,a2_film,a2_sport_game,a2_cook,a2_read,a2_school_event]
    B1_SCEN=[b1_walk,b1_club,b1_trip,b1_volunteer,b1_project,b1_health,
             b1_study,b1_festival,b1_env,b1_career,b1_tech,b1_family_plan]

    def build(scenarios, n, level, tag):
        items=[]; sigs=set(); tries=0
        while len(items)<n and tries<n*40:
            tries+=1
            dlg,qs=random.choice(scenarios)()
            # 去重键：对话+提问+正确答项内容（不含选项位置打乱），避免同一对话重复出现
            ans_txt=[q["opts"][q["ans"]] for q in qs]
            sig=repr(([(x["s"],x["t"]) for x in dlg],
                      [q["q"] for q in qs],
                      ans_txt))
            if sig in sigs: continue
            sigs.add(sig); items.append((dlg,qs))
        for i,(dlg,qs) in enumerate(items):
            out[level].append({"id":f"lc_{tag}_{i+1:03d}","dialogue":dlg,"questions":qs})

    build(A1_SCEN,100,"A1","a1")
    build(A2_SCEN,100,"A2","a2")
    build(B1_SCEN,100,"B1","b1")
    return out

def gen_listenanswer():
    out={"A1":[],"A2":[],"B1":[]}
    A1_HOBBY=["drawing pictures","reading books","playing football","singing songs","swimming","dancing","riding a bike","flying a kite","playing basketball"]
    # 动作谓语动词形式（可接在 "I / we" 后）：与 A1_HOBBY 一一对应
    HOBBY_VB=["draw pictures","read books","play football","sing songs","swim","dance","ride a bike","fly a kite","play basketball"]
    SUBJ=["Chinese","maths","English","science","art","music","PE","history","geography"]
    ROOM_THING=["a small desk","a red chair","a white bed","a blue shelf","a green lamp","a big window"]
    SEASON=["spring","summer","autumn","winter"]
    SEASON_ACT={"spring":["fly kites","plant flowers","go for walks"],
                "summer":["go swimming","eat ice cream","play in the park"],
                "autumn":["pick apples","ride bikes","take photos"],
                "winter":["make snowmen","drink hot tea","read books at home"]}
    B1_WHY=["keep healthy","make new friends","learn new things","help others","protect the earth","have fun"]
    B1_WHERE=["the library","the park","the museum","the sports center","the old people's home","the community center"]
    B1_CLUB=["a reading club","a music club","a science club","an art club","a sports club"]
    B1_ENV=["plant trees","save water","ride a bike","reuse paper","pick up litter","clean the river"]
    B1_CAREER=["a teacher","a scientist","a doctor","an artist","a writer","a pilot"]
    B1_APP=["a study app","a reading app","a drawing app","a music app"]
    B1_HABIT=["run in the morning","eat more fruit","drink more water","read before sleep","walk to school"]

    # ===================== A1 场景（一般现在时 / 自我介绍与生活） =====================
    def a1_self_intro():
        n=random.choice(NAMES); age=random.choice(AGE); food=random.choice(FRUITS); pet=random.choice(ANIMALS); pname=random.choice(PET_NAMES); hobby=random.choice(A1_HOBBY)
        mono=f"Hello, I am {n}. I am {age} years old. I like {food}. I have a {pet} and its name is {pname}. I like {hobby} after school."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"How old is the speaker?"},
                             {"q":"What pet does the speaker have?"},{"q":"What does the speaker like doing after school?"}],
                "keys":[n,f"{cap(age)} years old",f"A {pet} (named {pname})",cap(hobby)]}
    def a1_school_day():
        n=random.choice(NAMES); t=random.choice(TIME); tr=random.choice(TRANSPORT); subj=random.choice(SUBJ); hobby=random.choice(A1_HOBBY)
        mono=f"I am {n}. I get up at {t} every day. I go to school by {tr}. My favourite subject is {subj}. After school I like {hobby}."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What time does the speaker get up?"},
                             {"q":"How does the speaker go to school?"},{"q":"What is the speaker's favourite subject?"}],
                "keys":[n,f"At {t}",f"By {tr}",cap(subj)]}
    def a1_my_family():
        n=random.choice(NAMES); num=random.choice(["three","four","five"]); w1=random.choice(FAMILY); w2=random.choice(FAMILY); hobby=random.choice(A1_HOBBY)
        mono=f"My name is {n}. There are {num} people in my family. They are my {w1}, my {w2} and me. We like {hobby} together on Sunday."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"How many people are in the speaker's family?"},
                             {"q":"Who are they?"},{"q":"What do they like doing together?"}],
                "keys":[n,f"{cap(num)} people",f"His/Her {w1} and {w2}",cap(hobby)]}
    def a1_my_room():
        n=random.choice(NAMES); size=random.choice(["small","big","clean"]); th1=random.choice(ROOM_THING); th2=random.choice(ROOM_THING)
        mono=f"I am {n}. I have a {size} room. There is {th1} and {th2} in it. I like reading books there every evening."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What is the speaker's room like?"},
                             {"q":"What is in the room?"},{"q":"What does the speaker like doing in the room?"}],
                "keys":[n,cap(size),f"{cap(th1)} and {th2}","Reading books"]}
    def a1_best_friend():
        n=random.choice(NAMES); f=random.choice(NAMES); age=random.choice(AGE); food=random.choice(FRUITS); pet=random.choice(ANIMALS)
        mono=f"{f} is my best friend. {pronoun_cap(f)} is {age} years old. {pronoun_cap(f)} likes {food}. {pronoun_cap(f)} has a {pet}."
        return {"monologue":mono,
                "questions":[{"q":"Who is the speaker's best friend?"},{"q":"How old is the speaker's friend?"},
                             {"q":"What food does the friend like?"},{"q":"What pet does the friend have?"}],
                "keys":[f,f"{cap(age)} years old",cap(food),f"A {pet}"]}
    def a1_fav_subject():
        n=random.choice(NAMES); subj=random.choice(SUBJ); why=random.choice(["it is interesting","it is useful","it is fun","I like the teacher"]); vb=random.choice(HOBBY_VB)
        mono=f"Hello, I am {n}. My favourite subject is {subj}, because {why}. After class I often {vb} with my friends."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What is the speaker's favourite subject?"},
                             {"q":"Why does the speaker like it?"},{"q":"What does the speaker do after class?"}],
                "keys":[n,cap(subj),cap(why),"Plays/does it with friends"]}
    def a1_weekend():
        n=random.choice(NAMES); act1=random.choice(A1_HOBBY); act2=random.choice(["visit my grandma","help my mother","go to the park","read story books"]); food=random.choice(FRUITS)
        mono=f"I am {n}. On weekends I like {act1}. Sometimes I {act2}. In the evening I eat {food} with my family."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What does the speaker like doing on weekends?"},
                             {"q":"What does the speaker sometimes do?"},{"q":"What does the speaker eat in the evening?"}],
                "keys":[n,cap(act1),cap(act2),cap(food)]}
    def a1_fav_food():
        n=random.choice(NAMES); food=random.choice(FRUITS); color=random.choice(COLORS); when=random.choice(["in the morning","after lunch","in the evening"])
        mono=f"My name is {n}. My favourite food is {food}. They are {color}. I often eat them {when}."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What is the speaker's favourite food?"},
                             {"q":"What color are they?"},{"q":"When does the speaker eat them?"}],
                "keys":[n,cap(food),cap(color),cap(when)]}
    def a1_my_pet():
        n=random.choice(NAMES); pet=random.choice(ANIMALS); pname=random.choice(PET_NAMES); place=random.choice(PET_PLACE); food=random.choice(FRUITS)
        mono=f"I am {n}. I have a {pet}. Its name is {pname}. It lives in {place}. I feed it {food} every day."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What pet does the speaker have?"},
                             {"q":"Where does the pet live?"},{"q":"What does the speaker feed it?"}],
                "keys":[n,f"A {pet}",cap(place),cap(food)]}
    def a1_fav_season():
        n=random.choice(NAMES); s=random.choice(SEASON); act=random.choice(SEASON_ACT[s]); feel=random.choice(["happy","cool","warm","excited"])
        mono=f"Hello, I am {n}. My favourite season is {s}. I like to {act} in {s}. I feel {feel} then."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What is the speaker's favourite season?"},
                             {"q":"What does the speaker like doing then?"},{"q":"How does the speaker feel?"}],
                "keys":[n,cap(s),cap(act),cap(feel)]}
    def a1_birthday():
        n=random.choice(NAMES); m=random.choice(MONTH); gift=random.choice(["a book","a cake","a toy","a pen"]); who=random.choice(FAMILY)
        mono=f"I am {n}. My birthday is in {m}. I want {gift} this year. My {who} will make a cake for me."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"When is the speaker's birthday?"},
                             {"q":"What does the speaker want this year?"},{"q":"Who will make a cake?"}],
                "keys":[n,cap(m),cap(gift),f"His/Her {who}"]}
    def a1_school_thing():
        n=random.choice(NAMES); thing=random.choice(["a red bag","a blue pen","a green ruler","a yellow book"]); subj=random.choice(SUBJ); vb=random.choice(HOBBY_VB)
        mono=f"My name is {n}. I take {thing} to school every day. I study {subj} in the morning. After school I {vb}."
        return {"monologue":mono,
                "questions":[{"q":"What is the speaker's name?"},{"q":"What does the speaker take to school?"},
                             {"q":"What does the speaker study in the morning?"},{"q":"What does the speaker do after school?"}],
                "keys":[n,cap(thing),cap(subj),cap(vb)]}

    # ===================== A2 场景（一般过去时 / 经历） =====================
    def a2_yesterday():
        n=random.choice(NAMES); act,act_key=MORNING_ACT[random.randrange(len(MORNING_ACT))]; rel=random.choice(REL); food=random.choice(FRUITS)
        mono=f"I am {n}. Yesterday I {act} in the morning. Then I visited my {rel}. We ate {food} together. I was very happy."
        return {"monologue":mono,
                "questions":[{"q":"What did the speaker do in the morning?"},{"q":"Who did the speaker visit?"},
                             {"q":"What did they eat together?"},{"q":"How did the speaker feel?"}],
                "keys":[act_key,f"His/Her {rel}",f"(ate) {food}","Happy"]}
    def a2_trip():
        n=random.choice(NAMES); p=random.choice(GO_PLACE); tr=random.choice(TRANSPORT); rel=random.choice(REL); food=random.choice(FRUITS)
        mono=f"I am {n}. Last weekend I went to the {p} with my {rel}. We went there by {tr}. We ate {food} there. It was a great day."
        return {"monologue":mono,
                "questions":[{"q":"Where did the speaker go last weekend?"},{"q":"Who went with the speaker?"},
                             {"q":"How did they get there?"},{"q":"What did they eat there?"}],
                "keys":[f"The {p}",f"His/Her {rel}",f"By {tr}",cap(food)]}
    def a2_birthday():
        n=random.choice(NAMES); g=random.choice(["a story book","a toy car","a blue pen","a football"]); who=random.choice(FAMILY); food=random.choice(FOOD2)
        mono=f"I am {n}. Yesterday was my birthday. I got {g} from my {who}. We ate {food} and sang songs. I was excited."
        return {"monologue":mono,
                "questions":[{"q":"What gift did the speaker get?"},{"q":"Who gave it to the speaker?"},
                             {"q":"What did they eat?"},{"q":"How did the speaker feel?"}],
                "keys":[cap(g),f"His/Her {who}",cap(food),"Excited"]}
    def a2_sports_day():
        n=random.choice(NAMES); sp=random.choice(SPORT); win=random.choice(["won","lost","drew"]); who=random.choice(FAMILY)
        mono=f"I am {n}. We had a sports day at school. I played {sp} with my classmates. Our team {win} the game. My {who} came to watch."
        return {"monologue":mono,
                "questions":[{"q":"What sport did the speaker play?"},{"q":"Who did the speaker play with?"},
                             {"q":"Did they win the game?"},{"q":"Who came to watch?"}],
                "keys":[cap(sp),"Classmates",cap(win),f"His/Her {who}"]}
    def a2_help():
        n=random.choice(NAMES); who=random.choice(FAMILY); did=random.choice(["carried heavy bags","cleaned the room","cooked dinner","walked the dog"]); feel=random.choice(["happy","tired","proud"])
        mono=f"I am {n}. Yesterday I helped my {who}. I {did} to help my {who}. We finished in the evening. I felt {feel}."
        return {"monologue":mono,
                "questions":[{"q":"Who did the speaker help?"},{"q":"What did the speaker do?"},
                             {"q":"When did they finish?"},{"q":"How did the speaker feel?"}],
                "keys":[f"His/Her {who}",cap(did),"In the evening",cap(feel)]}
    def a2_film():
        n=random.choice(NAMES); who=random.choice(FAMILY); adj=random.choice(["interesting","boring","exciting","funny"]); place=random.choice(["the cinema","the park","my home"])
        mono=f"I am {n}. Last Sunday I watched a film with my {who}. We watched it {place}. The film was {adj}. We laughed a lot."
        return {"monologue":mono,
                "questions":[{"q":"Who did the speaker watch the film with?"},{"q":"Where did they watch it?"},
                             {"q":"What was the film like?"},{"q":"How did they feel?"}],
                "keys":[f"His/Her {who}",cap(place),cap(adj),"They laughed (happy)"]}
    def a2_cook():
        n=random.choice(NAMES); food=random.choice(FOOD2); who=random.choice(FAMILY); feel=random.choice(["happy","tired","proud"])
        mono=f"I am {n}. Last night I cooked {food} for my {who}. My {who} liked it very much. I was {feel}."
        return {"monologue":mono,
                "questions":[{"q":"What did the speaker cook?"},{"q":"Who did the speaker cook for?"},
                             {"q":"Did the person like it?"},{"q":"How did the speaker feel?"}],
                "keys":[cap(food),f"His/Her {who}","Yes, liked it",cap(feel)]}
    def a2_lost():
        n=random.choice(NAMES); lost=random.choice(["a red bag","a blue pen","a story book","a black umbrella","a green ruler"]); lp=random.choice(["in the classroom","on the bus","in the library","at the park"]); finder=random.choice(["a classmate","the teacher","a kind girl","the bus driver"])
        mono=f"I am {n}. I lost {lost} yesterday. I lost it {lp}. {cap(finder)} found it and gave it back to me. I said thank you."
        return {"monologue":mono,
                "questions":[{"q":"What did the speaker lose?"},{"q":"Where did the speaker lose it?"},
                             {"q":"Who found it?"},{"q":"What did the speaker say?"}],
                "keys":[cap(lost),cap(lp),cap(finder),"Thank you"]}
    def a2_school_trip():
        n=random.choice(NAMES); p=random.choice(["the museum","the farm","the zoo","the beach"]); did=random.choice(["saw old things","fed the animals","took many photos","played on the sand"]); who=random.choice(FAMILY)
        mono=f"I am {n}. We had a school trip to {p} last Friday. I {did} there. My {who} came as a helper. We had a good time."
        return {"monologue":mono,
                "questions":[{"q":"Where did the school trip go?"},{"q":"What did the speaker do there?"},
                             {"q":"Who came as a helper?"},{"q":"How was the trip?"}],
                "keys":[cap(p),cap(did),f"His/Her {who}","Good / fun"]}
    def a2_reading():
        n=random.choice(NAMES); book=random.choice(["a story book","a science book","a picture book","a comic"]); where=random.choice(["in the library","at home","in the park"]); like=random.choice(["liked it","loved it","enjoyed it"])
        mono=f"I am {n}. Yesterday I read {book} {where}. The story was about a brave boy. I {like} very much."
        return {"monologue":mono,
                "questions":[{"q":"What did the speaker read?"},{"q":"Where did the speaker read it?"},
                             {"q":"What was the story about?"},{"q":"Did the speaker like it?"}],
                "keys":[cap(book),cap(where),"A brave boy","Yes, liked it"]}
    def a2_rainy_day():
        n=random.choice(NAMES); did=random.choice(["read books","watched TV","did homework","played cards"]); who=random.choice(FAMILY); food=random.choice(FOOD2)
        mono=f"I am {n}. It rained yesterday, so I stayed at home. I {did} all day. My {who} cooked {food} for me. It was a quiet day."
        return {"monologue":mono,
                "questions":[{"q":"What was the weather like yesterday?"},{"q":"What did the speaker do at home?"},
                             {"q":"Who cooked for the speaker?"},{"q":"How was the day?"}],
                "keys":["Rainy","Stayed home / read etc.",f"His/Her {who}","Quiet"]}
    def a2_market():
        n=random.choice(NAMES); obj=random.choice(["some fruit","a cake","a toy","some eggs","a pen","a gift"]); pay=random.choice(["ten yuan","twenty yuan","five yuan","fifteen yuan","thirty yuan"]); who=random.choice(REL)
        mono=f"I am {n}. Last Sunday I went to the market with my {who}. I bought {obj}. It was {pay}. We walked home together."
        return {"monologue":mono,
                "questions":[{"q":"Where did the speaker go?"},{"q":"What did the speaker buy?"},
                             {"q":"How much was it?"},{"q":"Who went with the speaker?"}],
                "keys":["The market",cap(obj),pay,f"His/Her {who}"]}
    def a2_school_event():
        n=random.choice(NAMES); ev=random.choice(EVENT); did=random.choice(["sang songs","drew pictures","made posters","played games"]); who=random.choice(FAMILY)
        mono=f"I am {n}. Our school had {with_art(ev)} last week. I {did} there. My {who} came to watch. Everyone was happy."
        return {"monologue":mono,
                "questions":[{"q":"What event did the school have?"},{"q":"What did the speaker do?"},
                             {"q":"Who came to watch?"},{"q":"How did everyone feel?"}],
                "keys":[cap(ev),cap(did),f"His/Her {who}","Happy"]}

    # ===================== B1 场景（将来时 / 综合） =====================
    def b1_school_event():
        ev=random.choice(EVENT); day=random.choice(["next Friday","next Monday","next Wednesday","this weekend"]); t1=random.choice(["nine in the morning","eight in the morning","ten in the morning"]); t2=random.choice(["four in the afternoon","five in the afternoon","three in the afternoon"]); act=random.choice(ACTIVITY)
        mono=f"Our school will have {with_art(ev)} {day}. It will open at {t1} and close at {t2}. Students can {act}. Everyone is welcome to join."
        return {"monologue":mono,
                "questions":[{"q":f"When will the {ev} be?"},{"q":"When will it open and close?"},
                             {"q":"What can students do there?"},{"q":"Who is welcome?"}],
                "keys":[cap(day),f"From {t1} to {t2}",cap(act),"Everyone"]}
    def b1_volunteer():
        n=random.choice(NAMES); what=random.choice(["help old people","clean the park","visit sick children","plant trees"]); where=random.choice(B1_WHERE); why=random.choice(B1_WHY)
        mono=f"I am {n}. Next month I will work as a volunteer. I will {what} at {where}. I want to do it because it helps me {why}."
        return {"monologue":mono,
                "questions":[{"q":"What will the speaker do as a volunteer?"},{"q":"Where will the speaker do it?"},
                             {"q":"When will the speaker do it?"},{"q":"Why does the speaker want to do it?"}],
                "keys":[cap(what),cap(where),"Next month",cap(why)]}
    def b1_study_plan():
        n=random.choice(NAMES); what=random.choice(["read English","practice speaking","listen to tapes","write diaries"]); dur=random.choice(["half an hour","an hour","twenty minutes","forty minutes"]); why=random.choice(B1_WHY)
        mono=f"I am {n}. I plan to study harder this term. I will {what} every day for {dur}. I hope it will help me {why}."
        return {"monologue":mono,
                "questions":[{"q":"What will the speaker do to study?"},{"q":"How long will the speaker study?"},
                             {"q":"How often will the speaker do it?"},{"q":"Why does the speaker study hard?"}],
                "keys":[cap(what),f"For {dur}","Every day",cap(why)]}
    def b1_festival():
        n=random.choice(NAMES); what=random.choice(["the Spring Festival","Christmas","the Mid-Autumn Festival","the Dragon Boat Festival"]); who=random.choice(["my family","my friends","my relatives"]); food=random.choice(["special food","dumplings","moon cakes","rice dumplings"])
        mono=f"I am {n}. I will spend {what} with {who}. We will eat {food} together. It is the most important time of the year for us."
        return {"monologue":mono,
                "questions":[{"q":f"How will the speaker spend {what}?"},{"q":"Who will the speaker spend it with?"},
                             {"q":"What will they eat?"},{"q":"Why is it important?"}],
                "keys":[cap(what),cap(who),cap(food),"Most important time"]}
    def b1_club():
        n=random.choice(NAMES); club=random.choice(B1_CLUB); plan=random.choice(["read more books","sing together","do experiments","draw pictures"]); freq=random.choice(["once a week","twice a month","every day"])
        mono=f"I am {n}. I will join {club} next term. We will {plan} in the club. We plan to meet {freq}. I think it will be fun."
        return {"monologue":mono,
                "questions":[{"q":"What club will the speaker join?"},{"q":"What will they do in the club?"},
                             {"q":"How often will they meet?"},{"q":"How does the speaker feel about it?"}],
                "keys":[cap(club),cap(plan),cap(freq),"Fun / positive"]}
    def b1_env():
        n=random.choice(NAMES); what=random.choice(B1_ENV); where=random.choice(B1_WHERE); why=random.choice(["protect the earth","save money","keep the city clean","help animals"])
        mono=f"I am {n}. I will take part in a green project. I will {what} at {where}. I do it because I want to {why}."
        return {"monologue":mono,
                "questions":[{"q":"What will the speaker do for the environment?"},{"q":"Where will the speaker do it?"},
                             {"q":"What project is it?"},{"q":"Why does the speaker do it?"}],
                "keys":[cap(what),cap(where),"A green project",cap(why)]}
    def b1_career():
        n=random.choice(NAMES); career=random.choice(B1_CAREER); why=random.choice(B1_WHY); how=random.choice(["study hard","read more books","practice every day","learn from others"])
        mono=f"I am {n}. I want to be {career} in the future. I want to do this because I hope to {why}. I will {how} to make my dream come true."
        return {"monologue":mono,
                "questions":[{"q":"What does the speaker want to be?"},{"q":"Why does the speaker want that?"},
                             {"q":"How will the speaker make it?"},{"q":"When is this for?"}],
                "keys":[cap(career),cap(why),cap(how),"The future"]}
    def b1_health():
        n=random.choice(NAMES); habit=random.choice(B1_HABIT); freq=random.choice(["every day","once a week","twice a week","every morning"]); why=random.choice(B1_WHY)
        mono=f"I am {n}. To keep healthy, I {habit} {freq}. It is a good habit. I believe it helps me {why}."
        return {"monologue":mono,
                "questions":[{"q":"What does the speaker do to keep healthy?"},{"q":"How often does the speaker do it?"},
                             {"q":"Is it a good habit?"},{"q":"Why is it good?"}],
                "keys":[cap(habit),cap(freq),"Yes, a good habit",cap(why)]}
    def b1_tech():
        n=random.choice(NAMES); app=random.choice(B1_APP); freq=random.choice(["every day","once a week","twice a month"]); why=random.choice(["learn faster","have fun","read more","practice speaking"])
        mono=f"I am {n}. I often use {app} to study. I use it {freq}. It helps me {why}. I think it is a useful tool."
        return {"monologue":mono,
                "questions":[{"q":"What app does the speaker often use?"},{"q":"How often does the speaker use it?"},
                             {"q":"What does it help the speaker do?"},{"q":"What does the speaker think of it?"}],
                "keys":[cap(app),cap(freq),cap(why),"A useful tool"]}
    def b1_family_holiday():
        n=random.choice(NAMES); where=random.choice(["the beach","the mountains","a big city","the countryside"]); when=random.choice(["next Saturday","this Friday","next month","during the holiday"]); who=random.choice(["my family","my parents","my grandparents"])
        mono=f"I am {n}. My family will go on holiday {when}. We will go to {where}. {cap(who)} will go with me. We cannot wait."
        return {"monologue":mono,
                "questions":[{"q":"When will the speaker's family go on holiday?"},{"q":"Where will they go?"},
                             {"q":"Who will go with the speaker?"},{"q":"How does the speaker feel?"}],
                "keys":[cap(when),cap(where),cap(who),"Excited / cannot wait"]}
    def b1_library():
        n=random.choice(NAMES); what=random.choice(["borrow books","read magazines","do homework","listen to tapes"]); when=random.choice(["this afternoon","tomorrow morning","after school","this weekend"]); who=random.choice(["my classmates","my sister","a friend"])
        mono=f"I am {n}. I will go to the library {when}. I plan to {what} there. I will go with {who}. The library is a quiet place."
        return {"monologue":mono,
                "questions":[{"q":"Where will the speaker go?"},{"q":"When will the speaker go?"},
                             {"q":"What will the speaker do there?"},{"q":"Who will go with the speaker?"}],
                "keys":["The library",cap(when),cap(what),cap(who)]}
    def b1_science_club():
        n=random.choice(NAMES); topic=random.choice(["make a robot","grow a plant","watch stars","do a small experiment"]); when=random.choice(["every Friday","twice a month","once a week"]); why=random.choice(B1_WHY)
        mono=f"I am {n}. I joined the science club. We will {topic} together {when}. Science is fun and it helps me {why}."
        return {"monologue":mono,
                "questions":[{"q":"What club did the speaker join?"},{"q":"What will they do in the club?"},
                             {"q":"How often do they meet?"},{"q":"Why does the speaker like science?"}],
                "keys":["The science club",cap(topic),cap(when),cap(why)]}

    A1_SCEN=[a1_self_intro,a1_school_day,a1_my_family,a1_my_room,a1_best_friend,a1_fav_subject,
             a1_weekend,a1_fav_food,a1_my_pet,a1_fav_season,a1_birthday,a1_school_thing]
    A2_SCEN=[a2_yesterday,a2_trip,a2_birthday,a2_sports_day,a2_help,a2_film,a2_cook,a2_lost,
             a2_school_trip,a2_reading,a2_rainy_day,a2_market,a2_school_event]
    B1_SCEN=[b1_school_event,b1_volunteer,b1_study_plan,b1_festival,b1_club,b1_env,b1_career,
             b1_health,b1_tech,b1_family_holiday,b1_library,b1_science_club]

    def build(scenarios, n, level, tag):
        items=[]; sigs=set(); tries=0
        while len(items)<n and tries<n*50:
            tries+=1
            d=random.choice(scenarios)()
            sig=repr((d["monologue"],[q["q"] for q in d["questions"]]))
            if sig in sigs: continue
            sigs.add(sig); items.append(d)
        for i,d in enumerate(items):
            d["id"]=f"la_{tag}_{i+1:03d}"
            out[level].append(d)

    build(A1_SCEN,100,"A1","a1")
    build(A2_SCEN,100,"A2","a2")
    build(B1_SCEN,100,"B1","b1")
    return out

def gen_retell():
    out={"A1":[],"A2":[],"B1":[]}
    RT_FOOD=["apples","bread","eggs","milk","noodles","rice"]
    RT_ACT=["football","basketball","games","chess","cards","kites"]
    RT_WHO=["a friend","his brother","her sister","my cousin","a classmate"]
    B1_WHY=["keep healthy","make new friends","learn new things","help others","protect the earth"]

    # ===================== A1 场景（一般现在时 / 简单事件序列） =====================
    def a1_routine():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n)
        t1=random.choice(TIME); t2=random.choice(TIME); food=random.choice(RT_FOOD); g=random.choice(RT_ACT)
        passage=(f"{n} is a student. {sex} gets up at {t1}. {sex} eats {food} for breakfast. "
                 f"{sex} goes to school. After that, {sexl} plays {g}. {sexl} goes home at {t2}.")
        pts=[n,f"gets up at {t1}",f"eats {food} for breakfast","goes to school",f"plays {g}",f"goes home at {t2}"]
        sample=(f"{n} is a student. First, {pronoun(n)} gets up at {t1}. Then {pronoun(n)} eats {food} for breakfast. "
                f"After that, {pronoun(n)} goes to school and plays {g}. Finally, {pronoun(n)} goes home at {t2}.")
        kws=[[n],[t1,"get up","gets up"],[food,"breakfast"],[ "school"],
             [g],[t2,"home"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_park():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); who=random.choice(RT_WHO)
        food=random.choice(RT_FOOD); g=random.choice(RT_ACT); t=random.choice(TIME)
        passage=(f"{n} is a student. {sex} goes to the park with {who}. {sex} flies a kite there. "
                 f"Then {sexl} eats {food}. {sexl} plays {g}. {sexl} goes home at {t}.")
        pts=[n,f"goes to the park with {who}","flies a kite",f"eats {food}",f"plays {g}",f"goes home at {t}"]
        sample=(f"First, {n} goes to the park with {who}. Then {pronoun(n)} flies a kite and eats {food}. "
                f"After that, {pronoun(n)} plays {g}. Finally, {pronoun(n)} goes home at {t}.")
        kws=[[n],["park",who],["kite","flies"],
             [food], [g], [t,"home"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_school_day():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); subj=random.choice(["Chinese","maths","English","science","art","music"])
        g=random.choice(RT_ACT); food=random.choice(RT_FOOD)
        passage=(f"{n} is a student. {sex} walks to school every day. {sex} has {subj} in the morning. "
                 f"{sex} eats {food} at noon. After class, {sexl} plays {g} with friends. {sexl} is happy.")
        pts=[n,"walks to school every day",f"has {subj} in the morning",f"eats {food} at noon",f"plays {g} with friends","is happy"]
        sample=(f"First, {n} walks to school. Then {pronoun(n)} has {subj} in the morning and eats {food} at noon. "
                f"After that, {pronoun(n)} plays {g} with friends. {pronoun_cap(n)} is happy.")
        kws=[[n],["walk","school"],
             [subj], [food,"noon"], [g,"friends"], ["happy"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_shopping():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); obj=random.choice(["a red bag","a blue pen","some fruit","a story book","a toy"])
        pay=random.choice(["ten yuan","twelve yuan","fifteen yuan","twenty yuan"]); who=random.choice(RT_WHO)
        passage=(f"{n} is a student. {sex} goes to the shop with {who}. {sex} buys {obj}. "
                 f"It is {pay}. Then {sexl} eats an ice cream. {sexl} goes home happy.")
        pts=[n,f"goes to the shop with {who}",f"buys {obj}",f"it is {pay}","eats an ice cream","goes home happy"]
        sample=(f"First, {n} goes to the shop with {who}. Then {pronoun(n)} buys {obj} for {pay}. "
                f"After that, {pronoun(n)} eats an ice cream. Finally, {pronoun(n)} goes home happy.")
        kws=[[n],["shop",who],
             [obj.split()[-1]], [pay], ["ice cream"], ["happy","home"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_birthday():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); gift=random.choice(["a cake","a toy","a book","a pen"])
        who=random.choice(RT_WHO); food=random.choice(RT_FOOD)
        passage=(f"Today is {n}'s birthday. {sex} gets a {gift} from {who}. {sex} eats a cake with friends. "
                 f"Then {sexl} sings songs. {sexl} is very happy.")
        pts=[f"Today is {n}'s birthday",f"gets a {gift} from {who}","eats a cake with friends","sings songs","is very happy"]
        sample=(f"First, it is {n}'s birthday and {pronoun(n)} gets a {gift} from {who}. Then {pronoun(n)} eats a cake with friends. "
                f"After that, {pronoun(n)} sings songs. {pronoun_cap(n)} is very happy.")
        kws=[["birthday",n],[gift,who],["cake","friends"],["songs","sing"],["happy"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_cooking():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); food=random.choice(["noodles","rice","soup","eggs"])
        who=random.choice(RT_WHO)
        passage=(f"{n} is a student. {sex} cooks {food} at home. {sex} washes the vegetables first. "
                 f"Then {sexl} eats {food} with {who}. {sexl} cleans the dishes. {sexl} feels proud.")
        pts=[n,f"cooks {food} at home","washes the vegetables",f"eats {food} with {who}","cleans the dishes","feels proud"]
        sample=(f"First, {n} cooks {food} at home and washes the vegetables. Then {pronoun(n)} eats {food} with {who}. "
                f"After that, {pronoun(n)} cleans the dishes. {pronoun_cap(n)} feels proud.")
        kws=[[n],[food,"cook"],["vegetables","wash"],
             [who],["dishes","clean"],["proud"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_pet():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); pet=random.choice(ANIMALS); food=random.choice(RT_FOOD)
        passage=(f"{n} has a {pet}. {sex} feeds the {pet} every morning. {sex} takes the {pet} for a walk. "
                 f"Then {sexl} gives it {food}. {sexl} plays with it. {sexl} loves the {pet}.")
        pts=[f"{n} has a {pet}","feeds it every morning","takes it for a walk",f"gives it {food}","plays with it","loves it"]
        sample=(f"First, {n} has a {pet} and feeds it every morning. Then {pronoun(n)} takes it for a walk. "
                f"After that, {pronoun(n)} gives it {food} and plays with it. {pronoun_cap(n)} loves the {pet}.")
        kws=[[n,pet],[pet,"feed","morning"],["walk"],
             [food],["play"],["love",pet]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_library():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); book=random.choice(["a story book","a picture book","a science book"])
        who=random.choice(RT_WHO)
        passage=(f"{n} is a student. {sex} goes to the library with {who}. {sex} borrows {book}. "
                 f"Then {sexl} reads it quietly. {sexl} returns home at five. {sexl} is happy.")
        pts=[n,f"goes to the library with {who}",f"borrows {book}","reads it quietly","returns home at five","is happy"]
        sample=(f"First, {n} goes to the library with {who} and borrows {book}. Then {pronoun(n)} reads it quietly. "
                f"After that, {pronoun(n)} returns home at five. {pronoun_cap(n)} is happy.")
        kws=[[n],["library",who],
             [book.split()[-1]],["read","quietly"],["five","home"],["happy"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_sports():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); sp=random.choice(SPORT); who=random.choice(RT_WHO)
        passage=(f"{n} likes sport. {sex} plays {sp} with {who} after school. {sex} runs first to warm up. "
                 f"Then {sexl} plays a match. {sexl} drinks water. {sexl} feels great.")
        pts=[f"{n} likes sport",f"plays {sp} with {who}","runs to warm up","plays a match","drinks water","feels great"]
        sample=(f"First, {n} likes sport and plays {sp} with {who}. Then {pronoun(n)} runs to warm up and plays a match. "
                f"After that, {pronoun(n)} drinks water. {pronoun_cap(n)} feels great.")
        kws=[[n, "sport"],[sp,who],["warm","run"],
             ["match"],["water","drink"],["great"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a1_rain():
        n=random.choice(NAMES); sex=pronoun_cap(n); sexl=pronoun(n); act=random.choice(["reads books","draws pictures","plays chess","watches TV"])
        food=random.choice(RT_FOOD)
        passage=(f"It is rainy today. {n} stays at home. {sex} {act} in the room. Then {sexl} eats {food}. "
                 f"{sexl} sleeps early. {sexl} is quiet and calm.")
        pts=["it is rainy today",f"{n} stays at home",f"{sexl} {act} in the room",f"eats {food}","sleeps early","quiet and calm"]
        sample=(f"First, it is rainy, so {n} stays at home. Then {pronoun(n)} {act} and eats {food}. "
                f"After that, {pronoun(n)} sleeps early. {pronoun_cap(n)} is quiet and calm.")
        kws=[["rain","rainy"],["home","stay"],
             [act.split()[0]], [food],["sleep"], ["quiet","calm"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}

    # ===================== A2 场景（一般过去时 / 经历序列） =====================
    def a2_zoo():
        n=random.choice(NAMES); who=random.choice(REL); a1=random.choice(ANIMALS); a2=random.choice(ANIMALS)
        passage=(f"Last Sunday, {n} went to the zoo with my {who}. They saw a {a1} and a {a2}. "
                 f"They ate lunch near the lake. In the afternoon it rained, so they went home early. {n} was tired but happy.")
        pts=["Last Sunday",f"{n} + my {who}","went to the zoo",f"saw a {a1} and a {a2}","ate lunch near the lake","rained, went home early","tired but happy"]
        sample=(f"Last Sunday, {n} went to the zoo with my {who}. First, they saw a {a1} and a {a2}. "
                f"Then they ate lunch near the lake. After that, it rained, so they went home early. {n} was tired but happy.")
        kws=[["Sunday"],["zoo",who],[ "zoo"],[a1,a2],["lunch","lake"],["rain","rained"],["tired","happy"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_sports_day():
        n=random.choice(NAMES); sp=random.choice(SPORT); win=random.choice(["won","lost","drew"]); who=random.choice(FAMILY)
        passage=(f"We had a sports day at school. {n} played {sp} with classmates. Our team {win} the game. "
                 f"My {who} came to watch. Everyone cheered. We were excited.")
        pts=["sports day at school",f"{n} played {sp}","team {win} the game",f"my {who} came", "everyone cheered","excited"]
        sample=(f"First, we had a sports day. {n} played {sp} with classmates and our team {win}. "
                f"Then my {who} came to watch. Everyone cheered and we were excited.")
        kws=[["sports","school"],
             [sp], [win], [who],["cheer"],["excited"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_birthday():
        n=random.choice(NAMES); g=random.choice(["a story book","a toy car","a blue pen","a football"]); who=random.choice(FAMILY); food=random.choice(FOOD2)
        passage=(f"Yesterday was {n}'s birthday. {n} got {g} from my {who}. We ate {food} and sang songs. "
                 f"We took a photo. {n} was excited.")
        pts=[f"yesterday {n}'s birthday",f"got {g} from my {who}",f"ate {food}","sang songs","took a photo","excited"]
        sample=(f"First, yesterday was {n}'s birthday and {pronoun(n)} got {g} from my {who}. "
                f"Then we ate {food}, sang songs and took a photo. {pronoun_cap(n)} was excited.")
        kws=[["birthday",n,"yesterday"],[g,who],
             [food],["songs","sing"],["photo"],["excited"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_cleanup():
        n=random.choice(NAMES); place=random.choice(["the park","the beach","the garden","the street"]); who=random.choice(FAMILY)
        passage=(f"Last Saturday, {n} cleaned {place} with my {who}. They picked up litter and put it in bags. "
                 f"Then they swept the ground. They took a photo. The place looked clean.")
        pts=[f"last Saturday {n} cleaned {place}",f"with my {who}","picked up litter","swept the ground","took a photo","looked clean"]
        sample=(f"Last Saturday, {n} cleaned {place} with my {who}. First, they picked up litter. "
                f"Then they swept the ground and took a photo. The place looked clean.")
        kws=[["Saturday",place,n],[who],["litter"],["swept","ground"],["photo"],["clean"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_plant():
        n=random.choice(NAMES); who=random.choice(FAMILY)
        passage=(f"Our class planted trees on Tree Planting Day. First, the teacher showed us how to dig holes. "
                 f"Then {n} put small trees into the holes with my {who}. After that, we watered them. "
                 f"We took a photo. Everyone felt proud.")
        pts=["planted trees on Tree Planting Day","teacher showed digging",f"{n} put trees + soil with my {who}","watered them","took a photo","felt proud"]
        sample=(f"Our class planted trees on Tree Planting Day. First, the teacher showed us how to dig. "
                f"Then {n} put trees into holes with my {who} and we watered them. We took a photo and felt proud.")
        kws=[["Tree Planting","trees"],["teacher","dig"],["trees","soil",who],["water"],["photo"],["proud"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_rainy():
        n=random.choice(NAMES); did=random.choice(["read books","watched TV","did homework","played cards"]); who=random.choice(FAMILY); food=random.choice(FOOD2)
        passage=(f"It rained yesterday. {n} stayed at home. {n} {did} all day. My {who} cooked {food} for {pronoun(n)}. "
                 f"It was a quiet day. {n} felt calm.")
        pts=["rained yesterday",f"{n} stayed at home",f"{n} {did} all day",f"my {who} cooked {food}","quiet day","felt calm"]
        sample=(f"It rained yesterday. First, {n} stayed at home and {did}. Then my {who} cooked {food}. "
                f"It was a quiet day and {pronoun(n)} felt calm.")
        kws=[["rain","rained"],["home","stay"],
             [did.split()[0]],[who,food],["quiet"],["calm"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_lost():
        n=random.choice(NAMES); lost=random.choice(["a red bag","a blue pen","a story book","a black umbrella"]); lp=random.choice(["in the classroom","on the bus","in the library"])
        finder=random.choice(["a classmate","the teacher","a kind girl"])
        passage=(f"{n} lost {lost} yesterday. {n} lost it {lp}. {cap(finder)} found it and gave it back. "
                 f"{n} said thank you. {n} was happy again.")
        pts=[f"{n} lost {lost}","lost it {lp}",f"{cap(finder)} found it","gave it back","said thank you","happy again"]
        sample=(f"First, {n} lost {lost} {lp}. Then {cap(finder)} found it and gave it back. "
                f"{n} said thank you and was happy again.")
        kws=[[n,lost.split()[-1]],[lp],
             [finder],["back","gave"],["thank"],["happy"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_film():
        n=random.choice(NAMES); who=random.choice(FAMILY); adj=random.choice(["interesting","boring","exciting","funny"]); place=random.choice(["the cinema","my home","the park"])
        passage=(f"Last Sunday, {n} watched a film with my {who}. They watched it {place}. The film was {adj}. "
                 f"They laughed a lot. {n} wanted to see it again.")
        pts=[f"last Sunday {n} watched a film",f"with my {who}",f"watched it {place}",f"film was {adj}","laughed a lot","wanted to see again"]
        sample=(f"Last Sunday, {n} watched a film with my {who} {place}. The film was {adj}. "
                f"They laughed a lot and {pronoun(n)} wanted to see it again.")
        kws=[["film","Sunday",n],[who],
             [place], [adj],["laughed"],["again"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_cook():
        n=random.choice(NAMES); food=random.choice(FOOD2); who=random.choice(FAMILY); feel=random.choice(["happy","tired","proud"])
        passage=(f"Last night, {n} cooked {food} for my {who}. My {who} liked it very much. "
                 f"Then {n} washed the dishes. The kitchen was clean. {n} felt {feel}.")
        pts=[f"last night {n} cooked {food}",f"for my {who}","liked it",f"{n} washed dishes","kitchen clean",f"felt {feel}"]
        sample=(f"Last night, {n} cooked {food} for my {who} and my {who} liked it. "
                f"Then {pronoun(n)} washed the dishes. The kitchen was clean and {pronoun(n)} felt {feel}.")
        kws=[["night",food,n],[who],
             ["liked"],["dishes","wash"],["clean"],["feel",feel]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def a2_trip():
        n=random.choice(NAMES); p=random.choice(["the museum","the farm","the beach","the mountain"]); tr=random.choice(TRANSPORT); food=random.choice(FOOD2)
        passage=(f"Last Friday, {n} went to {p} by {tr}. {n} saw many old things there. "
                 f"They ate {food} at noon. Then they took photos. {n} had a good time.")
        pts=[f"last Friday {n} went to {p}",f"by {tr}","saw many old things",f"ate {food}","took photos","had a good time"]
        sample=(f"Last Friday, {n} went to {p} by {tr}. First, {pronoun(n)} saw many old things. "
                f"Then {pronoun(n)} ate {food} and took photos. {pronoun_cap(n)} had a good time.")
        kws=[["Friday",p,n],[tr],
             ["old things","saw"], [food],["photos"],["good time"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}

    # ===================== B1 场景（将来 / 综合 / 班级活动） =====================
    def b1_class_event(kind):
        n=random.choice(NAMES); who=random.choice(["the teacher","our monitor","the headmaster"]); when=random.choice(["next Friday","next Monday","this weekend","next month"])
        if kind==0:  # planting
            passage=(f"Our class will plant trees on Tree Planting Day {when}. First, {who} will show us how to dig holes. "
                     f"Then we will put small trees into the soil. After that, we will water them together. "
                     f"Finally, we will take a photo. Everyone will feel proud.")
            pts=[f"plant trees on Tree Planting Day {when}",f"{who} shows digging","put trees into soil","water together","take a photo","feel proud"]
            kws=[["Tree Planting","trees",when],[who,"dig"],["soil","trees"],["water"],["photo"],["proud"]]
        elif kind==1:  # cleanup
            passage=(f"Our class will clean the park on Clean-up Day {when}. First, {who} will give us gloves and bags. "
                     f"Then we will pick up litter and put it into bags. After that, we will sweep the paths. "
                     f"Finally, we will take a photo. The park will look clean.")
            pts=[f"clean the park on Clean-up Day {when}",f"{who} gives gloves and bags","pick up litter","sweep the paths","take a photo","park clean"]
            kws=[["Clean-up","park",when],[who,"gloves"],["litter"],["sweep"],["photo"],["clean"]]
        elif kind==2:  # sports
            passage=(f"Our class will have Sports Day {when}. First, we will line up on the playground. "
                     f"Then we will run in the relay race and cheer for each other. After that, we will watch the high jump. "
                     f"Finally, we will try to win the first prize. Everyone will be excited.")
            pts=[f"Sports Day {when}","line up on the playground","run relay + cheer","watch the high jump","win first prize","excited"]
            kws=[["Sports Day",when],["playground","line"],["relay","cheer"],["high jump"],["prize","won"],["excited"]]
        else:  # reading
            passage=(f"Our class will have a Reading Day {when}. First, we will go to the school library. "
                     f"Then we will choose our favorite books and read quietly. After that, we will share stories in groups. "
                     f"Finally, {who} will give us bookmarks. We will all enjoy the day.")
            pts=[f"Reading Day {when}","go to the library","choose books + read quietly","share stories in groups",f"{who} gives bookmarks","enjoy the day"]
            kws=[["Reading Day",when],["library"],["books","read"],["stories","share"],[who,"bookmarks"],["enjoy"]]
        sample=passage
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_volunteer():
        n=random.choice(NAMES); what=random.choice(["help old people","clean the river","visit sick children","plant trees in the school"]); where=random.choice(["the old people's home","the community center","the park","the hospital"]); why=random.choice(B1_WHY)
        passage=(f"Next month, {n} will work as a volunteer. {cap(pronoun(n))} will {what} at {where}. "
                 f"{cap(pronoun(n))} will go there every weekend. {cap(pronoun(n))} wants to do it because it helps {pronoun(n)} {why}. "
                 f"Many students will join, too.")
        pts=[f"next month {n} volunteers",f"will {what} at {where}","goes every weekend",f"to {why}","many students join"]
        sample=(f"Next month, {n} will volunteer. First, {pronoun(n)} will {what} at {where} every weekend. "
                f"{pronoun_cap(n)} wants to do it to {why}, and many students will join.")
        kws=[["month","volunteer",n],[what,where],["weekend"],
             [why],["students","join"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_event_announce():
        ev=random.choice(EVENT); day=random.choice(["next Friday","next Monday","this weekend"]); t1=random.choice(["nine in the morning","eight in the morning","ten in the morning"]); t2=random.choice(["four in the afternoon","five in the afternoon","three in the afternoon"]); act=random.choice(ACTIVITY)
        passage=(f"Our school will have {with_art(ev)} {day}. It will open at {t1} and close at {t2}. "
                 f"Students can {act} there. A famous writer will give a talk. Everyone is welcome.")
        pts=[f"{ev} {day}","open {t1} close {t2}",f"students can {act}","a writer gives a talk","everyone welcome"]
        sample=(f"Our school will have {with_art(ev)} {day}, from {t1} to {t2}. Students can {act} and a writer will give a talk. Everyone is welcome.")
        kws=[[ev,day],["open","close",t1],
             [act],["writer","talk"],["welcome"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_study_plan():
        n=random.choice(NAMES); what=random.choice(["read English","practice speaking","listen to tapes","write diaries"]); dur=random.choice(["half an hour","an hour","forty minutes"]); why=random.choice(B1_WHY)
        passage=(f"This term, {n} will study harder. {cap(pronoun(n))} will {what} every day for {dur}. "
                 f"{cap(pronoun(n))} will join a study group. {cap(pronoun(n))} hopes it will help {pronoun(n)} {why}.")
        pts=[f"this term {n} studies harder",f"will {what} for {dur} daily","joins a study group",f"hopes to {why}"]
        sample=(f"This term, {n} will study harder by doing {what} for {dur} every day and joining a study group, hoping to {why}.")
        kws=[["term","study",n],[what,dur],
             ["group"], [why]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_festival():
        n=random.choice(NAMES); what=random.choice(["the Spring Festival","Christmas","the Mid-Autumn Festival","the Dragon Boat Festival"]); who=random.choice(["my family","my relatives"]); food=random.choice(["dumplings","moon cakes","rice dumplings","special food"])
        passage=(f"Next year, {n} will spend {what} with {who}. They will eat {food} together. "
                 f"They will watch a show on TV. It will be the happiest time of the year.")
        pts=[f"next year {n} spends {what}",f"with {who}",f"eat {food}","watch a show on TV","happiest time"]
        sample=(f"Next year, {n} will spend {what} with {who}, eating {food} and watching a show. It will be the happiest time.")
        kws=[[what,"year",n],[who],
             [food],["show","TV"],["happiest"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_science():
        n=random.choice(NAMES); topic=random.choice(["make a robot","grow a plant","watch stars","do an experiment"]); when=random.choice(["every Friday","twice a month","once a week"]); why=random.choice(B1_WHY)
        passage=(f"This term, {n} joined the science club. The club will {topic} together {when}. "
                 f"{cap(pronoun(n))} will invite friends to join. Science is fun and it helps {pronoun(n)} {why}.")
        pts=[f"this term {n} joins science club",f"club will {topic} {when}","invites friends","science helps {why}"]
        sample=(f"This term, {n} joined the science club. The club will {topic} {when}, and {pronoun(n)} will invite friends. Science helps {why}.")
        kws=[["science","club",n],[topic,when],
             ["friends","invite"], [why]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_health():
        n=random.choice(NAMES); habit=random.choice(["run in the morning","eat more fruit","drink more water","walk to school"]); freq=random.choice(["every day","twice a week","once a week"]); why=random.choice(B1_WHY)
        passage=(f"To keep healthy, {n} will {habit} {freq}. {cap(pronoun(n))} will also sleep early. "
                 f"{cap(pronoun(n))} believes this good habit will help {pronoun(n)} {why}.")
        pts=[f"{n} will {habit} {freq}","also sleeps early",f"good habit helps {why}"]
        sample=(f"To keep healthy, {n} will {habit} {freq} and sleep early. This good habit will help {why}.")
        kws=[[n,habit,freq],
             ["sleep"], [why]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_library_plan():
        n=random.choice(NAMES); what=random.choice(["borrow books","read magazines","do homework","listen to English"]); when=random.choice(["this afternoon","tomorrow morning","after school"]); who=random.choice(["a friend","my sister","my classmate"])
        passage=(f"{n} will go to the library {when}. {cap(pronoun(n))} plans to {what} there. "
                 f"{cap(pronoun(n))} will go with {who}. The library is a quiet and useful place.")
        pts=[f"{n} goes to library {when}",f"plans to {what}",f"with {who}","library quiet and useful"]
        sample=(f"{n} will go to the library {when} with {who} and plans to {what}. The library is quiet and useful.")
        kws=[[n,"library",when],
             [what], [who],["quiet","useful"]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}
    def b1_community():
        n=random.choice(NAMES); what=random.choice(["clean the garden","paint the wall","plant flowers","collect old books"]); where=random.choice(["the community center","the park","the old people's home"]); why=random.choice(B1_WHY)
        passage=(f"Next weekend, {n} will join a community activity. {cap(pronoun(n))} will {what} at {where}. "
                 f"Many neighbours will come. {cap(pronoun(n))} does it because it helps {pronoun(n)} {why}.")
        pts=[f"next weekend {n} joins community activity",f"will {what} at {where}","many neighbours come",f"to {why}"]
        sample=(f"Next weekend, {n} will join a community activity and {what} at {where} with neighbours, to {why}.")
        kws=[["weekend","community",n],[what,where],
             ["neighbours"], [why]]
        return {"passage":passage,"points":pts,"sample":sample,"keywords":kws}

    A1_SCEN=[a1_routine,a1_park,a1_school_day,a1_shopping,a1_birthday,a1_cooking,a1_pet,a1_library,a1_sports,a1_rain]
    A2_SCEN=[a2_zoo,a2_sports_day,a2_birthday,a2_cleanup,a2_plant,a2_rainy,a2_lost,a2_film,a2_cook,a2_trip]
    B1_SCEN=[lambda: b1_class_event(0),lambda: b1_class_event(1),lambda: b1_class_event(2),lambda: b1_class_event(3),
             b1_volunteer,b1_event_announce,b1_study_plan,b1_festival,b1_science,b1_health,b1_library_plan,b1_community]

    def build(scenarios, n, level, tag):
        items=[]; sigs=set(); tries=0
        while len(items)<n and tries<n*60:
            tries+=1
            d=random.choice(scenarios)()
            sig=repr(d["passage"])
            if sig in sigs: continue
            sigs.add(sig); items.append(d)
        for i,d in enumerate(items):
            d["id"]=f"rt_{tag}_{i+1:03d}"
            out[level].append(d)

    build(A1_SCEN,100,"A1","a1")
    build(A2_SCEN,100,"A2","a2")
    build(B1_SCEN,100,"B1","b1")
    return out


def build_ask_bank():
    """生成询问信息题库：每条 (cn, en) 由同一组槽位同时构造，确保中英文严格对齐、语法正确。"""
    A1=[]; A2=[]; B1=[]

    # ===================== A1：一般现在时 / 基础 wh- 与 yes/no =====================
    # 1) What is your favorite X?
    for en,cn in [("fruit","水果"),("color","颜色"),("animal","动物"),("sport","运动"),
                  ("subject","科目"),("food","食物"),("book","书"),("drink","饮料"),
                  ("toy","玩具"),("game","游戏")]:
        A1.append((f"你最喜欢的{cn}是什么？", f"What is your favorite {en}?"))
    # 2) Do you like X?
    for en,cn in [("apples","苹果"),("bananas","香蕉"),("the dog","狗"),("football","足球"),
                  ("milk","牛奶"),("running","跑步"),("swimming","游泳"),("your school","你的学校"),
                  ("music","音乐"),("drawing","画画")]:
        A1.append((f"你喜欢{cn}吗？", f"Do you like {en}?"))
    # 3) How many X do you have?  (X 含量词)
    for en,cn in [("pencils","支铅笔"),("books","本书"),("apples","个苹果"),("friends","个朋友"),
                  ("cats","只猫"),("dogs","只狗"),("bags","个书包"),("eggs","个鸡蛋"),("rulers","把尺子")]:
        A1.append((f"你有多少{cn}？", f"How many {en} do you have?"))
    # 4) What color is your X?
    for en,cn in [("bag","书包"),("pen","钢笔"),("bike","自行车"),("shoes","鞋"),("hat","帽子"),("ruler","尺子")]:
        A1.append((f"你的{cn}是什么颜色？", f"What color is your {en}?"))
    # 5) Where do you X?
    for en,cn in [("study","上学"),("play","玩"),("eat","吃饭")]:
        A1.append((f"你在哪里{cn}？", f"Where do you {en}?"))
    # 6) When do you X?
    for en,cn in [("get up","起床"),("go to school","去上学"),("eat breakfast","吃早饭"),("go home","回家"),("go to bed","睡觉")]:
        A1.append((f"你什么时候{cn}？", f"When do you {en}?"))
    # 7) Who is your X?
    for en,cn in [("teacher","老师"),("friend","朋友"),("mother","妈妈"),("father","爸爸"),
                  ("brother","哥哥"),("sister","姐姐"),("grandma","奶奶"),("grandpa","爷爷")]:
        A1.append((f"你的{cn}是谁？", f"Who is your {en}?"))
    # 8) What do you do X?
    for en,cn in [("in the morning","早上"),("after school","放学后"),("on Sunday","星期天"),("in the evening","晚上")]:
        A1.append((f"你{cn}做什么？", f"What do you do {en}?"))
    # 9) What time do you X?
    for en,cn in [("get up","起床"),("go to school","去学校"),("have lunch","吃午饭"),("go home","回家"),("go to bed","睡觉")]:
        A1.append((f"你几点{cn}？", f"What time do you {en}?"))
    # 10) Can you X?
    for en,cn in [("swim","游泳"),("sing","唱歌"),("dance","跳舞"),("draw","画画"),("ride a bike","骑自行车"),("play football","踢足球")]:
        A1.append((f"你会{cn}吗？", f"Can you {en}?"))
    # 11) Is this your X?
    for en,cn in [("book","书"),("pen","钢笔"),("bag","书包"),("ruler","尺子")]:
        A1.append((f"这是你的{cn}吗？", f"Is this your {en}?"))
    # 12) Do you like to X?
    for en,cn in [("read books","读书"),("watch TV","看电视"),("play games","玩游戏")]:
        A1.append((f"你喜欢{cn}吗？", f"Do you like to {en}?"))
    # 13) Are you X?
    for en,cn in [("happy","开心"),("tired","累"),("busy","忙")]:
        A1.append((f"你{cn}吗？", f"Are you {en}?"))
    # 14) Where is your X?
    for en,cn in [("schoolbag","书包"),("home","家"),("classroom","教室")]:
        A1.append((f"你的{cn}在哪里？", f"Where is your {en}?"))
    # 15) Do you have a X?
    for en,cn in [("pet","宠物"),("bike","自行车"),("cat","猫"),("dog","狗"),("red bag","红色的书包"),("brother","弟弟")]:
        A1.append((f"你有{cn}吗？", f"Do you have a {en}?"))
    # 16) What X do you like?
    for en,cn in [("sports","运动"),("animals","动物"),("colors","颜色"),("fruits","水果"),("books","书"),("games","游戏")]:
        A1.append((f"你喜欢什么{cn}？", f"What {en} do you like?"))
    # 17) How old is your X?
    for en,cn in [("brother","哥哥"),("sister","姐姐"),("father","爸爸")]:
        A1.append((f"你的{cn}几岁？", f"How old is your {en}?"))
    # 18) 固定短句
    A1 += [
        ("你来自哪里？","Where are you from?"),
        ("你在几班？","What class are you in?"),
        ("你的电话号码是多少？","What is your phone number?"),
        ("现在几点了？","What time is it?"),
        ("今天星期几？","What day is today?"),
        ("这是什么？","What is this?"),
        ("你好吗？","How are you?"),
        ("你能帮我吗？","Can you help me?"),
        ("你多高？","How tall are you?"),
    ]

    # ===================== A2：一般过去时 / 频率 / why-how =====================
    # 1) What did you do X?
    for en,cn in [("yesterday","昨天"),("last weekend","上周末"),("last Sunday","上周日"),("last night","昨晚"),("last Friday","上周五"),("last month","上个月")]:
        A2.append((f"你{cn}做了什么？", f"What did you do {en}?"))
    # 2) Where did you go X?
    for en,cn in [("yesterday","昨天"),("last weekend","上周末"),("last summer","去年夏天"),("last month","上个月"),("last year","去年")]:
        A2.append((f"你{cn}去哪里了？", f"Where did you go {en}?"))
    # 3) What did you buy X?
    for en,cn in [("yesterday","昨天"),("last weekend","上周末")]:
        A2.append((f"你{cn}买了什么？", f"What did you buy {en}?"))
    # 4) How often do you X?
    for en,cn in [("go to the library","去图书馆"),("exercise","锻炼"),("watch TV","看电视"),("read books","看书"),
                  ("play football","踢足球"),("visit your grandma","看望奶奶"),("go to the park","去公园")]:
        A2.append((f"你多久{cn}一次？", f"How often do you {en}?"))
    # 5) Why do you like X?
    for en,cn in [("music","音乐"),("your school","你的学校"),("English","英语"),("sport","运动"),
                  ("reading","阅读"),("your teacher","你的老师"),("your family","你的家人")]:
        A2.append((f"你为什么喜欢{cn}？", f"Why do you like {en}?"))
    # 6) When do you X?
    for en,cn in [("finish your homework","完成作业"),("go to bed","睡觉"),("get up","起床"),("have lunch","吃午饭")]:
        A2.append((f"你什么时候{cn}？", f"When do you {en}?"))
    # 7) How do you X?
    for en,cn in [("study English","学英语"),("go to school","上学"),("keep healthy","保持健康"),("learn new words","记新单词")]:
        A2.append((f"你怎样{cn}？", f"How do you {en}?"))
    # 8) How many X do you have?
    for en,cn in [("English books","本英语书"),("pencils","支铅笔"),("friends","个朋友")]:
        A2.append((f"你有多少{cn}？", f"How many {en} do you have?"))
    # 9) What was your favorite X?
    for en,cn in [("subject","科目"),("food","食物"),("book","书"),("sport","运动")]:
        A2.append((f"你最喜欢的{cn}是什么？", f"What was your favorite {en}?"))
    # 10) Did you X Y?
    for en_v,cn_v,en_w,cn_w in [("watch a film","看电影","yesterday","昨天"),("go to the park","去公园","last weekend","上周末"),
                                ("cook dinner","做晚饭","last night","昨晚"),("clean your room","打扫房间","yesterday","昨天")]:
        A2.append((f"你{cn_w}{cn_v}了吗？", f"Did you {en_v} {en_w}?"))
    # 11) Where were you X?
    A2.append(("你出生在哪里？","Where were you born?"))
    A2.append(("你昨晚在哪里？","Where were you last night?"))
    # 12) What time do you X?
    for en,cn in [("get up","起床"),("go to school","去学校"),("finish homework","完成作业")]:
        A2.append((f"你几点{cn}？", f"What time do you {en}?"))
    # 13) 固定/简单
    A2 += [
        ("你和谁一起去的？","Who did you go with?"),
        ("你玩得开心吗？","Did you have fun?"),
        ("你昨天吃了什么？","What did you eat yesterday?"),
        ("你上周末吃了什么？","What did you eat last weekend?"),
        ("你的周末过得怎么样？","How was your weekend?"),
        ("你的旅行怎么样？","How was your trip?"),
        ("你的生日过得怎么样？","How was your birthday?"),
        ("你为什么迟到？","Why were you late?"),
        ("你学了什么？","What did you learn?"),
        ("你怎么去的？","How did you go there?"),
        ("你的老师说了什么？","What did your teacher say?"),
        ("你开心吗？","Were you happy?"),
        ("你看到了多少只动物？","How many animals did you see?"),
        ("你为你的妈妈做了什么？","What did you do for your mother?"),
        ("你什么时候到的？","When did you arrive?"),
        ("谁帮了你？","Who helped you?"),
        ("你给妈妈买了什么？","What did you buy for your mother?"),
        ("你给姐姐买了什么？","What did you buy for your sister?"),
        ("它有趣吗？","Was it interesting?"),
        ("它在好吗？","Was it good?"),
        ("你在哪里见到他的？","Where did you meet him?"),
        ("你几点回来的？","What time did you come back?"),
        ("你完成作业了吗？","Did you finish your homework?"),
        ("你给了爸爸什么？","What did you give your father?"),
        ("你给了朋友什么？","What did you give your friend?"),
        ("花了多长时间？","How long did it take?"),
        ("你穿了什么？","What did you wear?"),
        ("你和谁一起玩的？","Who did you play with?"),
        ("你喝了什么？","What did you drink?"),
        ("你给你妈妈打电话了吗？","Did you call your mother?"),
        ("你给你朋友打电话了吗？","Did you call your friend?"),
        ("天气怎么样？","What was the weather like?"),
        ("你睡在哪里？","Where did you sleep?"),
        ("你画了什么？","What did you draw?"),
        ("谁赢了比赛？","Who won the game?"),
    ]
    # 14) 补充 A2 经历类
    A2 += [
        ("你做了什么有趣的事？","What did you do for fun?"),
        ("你拜访了谁？","Who did you visit?"),
        ("你收到了什么礼物？","What gift did you get?"),
        ("你拍照了吗？","Did you take photos?"),
        ("老师告诉了你什么？","What did the teacher tell you?"),
        ("食物怎么样？","How was the food?"),
        ("派对几点开始的？","What time did the party start?"),
        ("谁来了派对？","Who came to the party?"),
        ("你写了什么？","What did you write?"),
        ("你喜欢这次旅行吗？","Did you enjoy the trip?"),
        ("你在博物馆看到了什么？","What did you see at the museum?"),
        ("你对考试感觉如何？","How did you feel about the exam?"),
        ("你为家人做了什么菜？","What did you cook for your family?"),
        ("你在哪里见的朋友？","Where did you meet your friends?"),
        ("你丢了什么？","What did you lose?"),
        ("你帮妈妈了吗？","Did you help your mother?"),
        ("你找到了什么？","What did you find?"),
        ("那里有多少人？","How many people were there?"),
        ("你从旅行中学到了什么？","What did you learn from the trip?"),
        ("天气好吗？","Was the weather good?"),
    ]

    # ===================== B1：将来 / 条件 / 观点 / 综合 =====================
    # 1) What will you do if X?
    for en,cn in [("it rains","下雨"),("the exam is difficult","考试很难"),("you fail","不及格"),
                  ("you are late","迟到"),("you get lost","迷路"),("it snows","下雪")]:
        B1.append((f"如果{cn}你会做什么？", f"What will you do if {en}?"))
    # 2) Why do you want to X?
    for en,cn in [("learn English","学英语"),("join this club","加入这个俱乐部"),("be a teacher","当老师"),("help others","帮助他人"),("travel","旅行")]:
        B1.append((f"你为什么想{cn}？", f"Why do you want to {en}?"))
    # 3) How can you X?
    for en,cn in [("improve your speaking","提高口语"),("keep healthy","保持健康"),("learn English well","学好英语"),("make more friends","交更多朋友")]:
        B1.append((f"你怎样能{cn}？", f"How can you {en}?"))
    # 4) What do you want to be X?
    for en,cn in [("when you grow up","长大后"),("in the future","将来")]:
        B1.append((f"你{cn}想做什么？", f"What do you want to be {en}?"))
    # 5) What is your favorite X, and why?
    for en,cn in [("book","书"),("sport","运动"),("subject","科目"),("movie","电影")]:
        B1.append((f"你最喜欢的{cn}是什么，为什么？", f"What is your favorite {en}, and why?"))
    # 6) Do you think X?
    for en,cn in [("phones help you study","手机对你的学习有帮助"),("sport is important","运动很重要"),("reading is useful","阅读有用"),("homework is necessary","作业有必要")]:
        B1.append((f"你觉得{cn}吗？", f"Do you think {en}?"))
    # 7) How often do you X?
    for en,cn in [("watch a film","看电影"),("exercise","锻炼"),("read books","读书"),("go to the library","去图书馆")]:
        B1.append((f"你多久{cn}一次？", f"How often do you {en}?"))
    # 8) Where do you want to live X?
    for en,cn in [("in the future","将来"),("after you graduate","毕业后")]:
        B1.append((f"你{cn}想住在哪里？", f"Where do you want to live {en}?"))
    # 9) What did you do X?
    for en,cn in [("last summer holiday","去年暑假"),("last weekend","上周末"),("last year","去年"),("during the holiday","假期里")]:
        B1.append((f"你{cn}做了什么？", f"What did you do {en}?"))
    # 10) When is X?
    for en,cn in [("your friend's birthday","你朋友的生日"),("the school trip","学校旅行"),("the exam","考试"),("the festival","节日")]:
        B1.append((f"{cn}是什么时候？", f"When is {en}?"))
    # 11) What should we do to X?
    for en,cn in [("protect the earth","保护地球"),("keep healthy","保持健康"),("save energy","节约能源"),("help others","帮助他人")]:
        B1.append((f"我们应该做什么来{cn}？", f"What should we do to {en}?"))
    # 12) Would you like to X?
    for en,cn in [("join the club","加入俱乐部"),("help others","帮助他人"),("travel abroad","出国旅行"),("learn a new language","学一门新语言")]:
        B1.append((f"你愿意{cn}吗？", f"Would you like to {en}?"))
    # 13) How do you X?
    for en,cn in [("study for the exam","备考"),("relax after school","放学后放松"),("make friends","交朋友")]:
        B1.append((f"你怎样{cn}？", f"How do you {en}?"))
    # 14) What are you going to do X?
    for en,cn in [("this weekend","这个周末"),("next holiday","下个假期")]:
        B1.append((f"你{cn}打算做什么？", f"What are you going to do {en}?"))
    # 15) What do you think of X?
    for en,cn in [("your school","你的学校"),("English","英语"),("the Internet","网络")]:
        B1.append((f"你觉得{cn}怎么样？", f"What do you think of {en}?"))
    # 16) How will you X?
    for en,cn in [("go to work","去上班"),("learn English","学英语"),("keep healthy","保持健康")]:
        B1.append((f"你会怎样{cn}？", f"How will you {en}?"))
    # 17) What is the best way to X?
    for en,cn in [("learn English","学英语"),("make friends","交朋友"),("keep healthy","保持健康")]:
        B1.append((f"{cn}最好的方法是什么？", f"What is the best way to {en}?"))
    # 18) Why is X important?
    for en,cn in [("English","英语"),("sport","运动"),("reading","阅读")]:
        B1.append((f"为什么{cn}很重要？", f"Why is {en} important?"))
    # 19) 固定/观点/综合
    B1 += [
        ("如果你有问题会怎么办？","If you have a problem, what will you do?"),
        ("你周末通常做什么？","What do you usually do on weekends?"),
        ("你喜欢什么类型的书？","What kind of books do you like?"),
        ("你最好的朋友是谁？","Who is your best friend?"),
        ("你想买什么？","What do you want to buy?"),
        ("你花多少时间做作业？","How much time do you spend on homework?"),
        ("你的梦想是什么？","What is your dream?"),
        ("你同意学生应该用手机吗？","Do you agree that students should use phones?"),
        ("什么让你开心？","What makes you happy?"),
        ("2050年的生活会是怎样的？","What will life be like in 2050?"),
        ("你和同学相处得怎么样？","How do you get on with your classmates?"),
        ("学生应该做什么来保护环境？","What should students do to protect the environment?"),
        ("最有用的发明是什么？","What is the most useful invention?"),
        ("人们为什么旅行？","Why do people travel?"),
        ("我们能做什么来帮助穷人？","What can we do to help the poor?"),
        ("你多久帮一次父母？","How often do you help your parents?"),
        ("你难过的时候做什么？","What do you do when you are sad?"),
        ("你的暑假计划是什么？","What is your plan for the summer holiday?"),
        ("你认为钱最重要吗？","Do you think money is the most important?"),
        ("我们怎样节约用水？","How can we save water?"),
        ("你认为什么工作最好？","What job do you think is the best?"),
        ("你对在线学习有什么看法？","What is your opinion on online learning?"),
        ("如果你会飞，你会做什么？","If you could fly, what would you do?"),
        ("你早饭通常吃什么？","What do you usually eat for breakfast?"),
        ("你最崇拜谁？","Who do you admire most?"),
        ("你城市最大的问题是什么？","What is the biggest problem in your city?"),
        ("你和朋友怎么保持联系？","How do you keep in touch with friends?"),
        ("你想改变学校的什么？","What do you want to change about your school?"),
        ("为什么学外语很重要？","Why is it important to learn a foreign language?"),
        ("你毕业后会做什么？","What will you do after graduation?"),
        ("学英语最好的年龄是几岁？","What is the best age to learn English?"),
        ("你更喜欢城市还是乡村？","Do you prefer cities or the countryside?"),
        ("青少年怎样安全上网？","What can teenagers do to stay safe online?"),
        ("你怎么庆祝生日？","How do you celebrate your birthday?"),
        ("你认为成功的关键是什么？","What do you think is the key to success?"),
        ("如果你有一百万元，你会做什么？","If you had one million yuan, what would you do?"),
        ("中国最重要的节日是什么？","What is the most important festival in China?"),
    ]

    # 去重（按 (cn,en) 对），并各取前 100
    def dedup_unique(lst):
        seen=set(); out=[]
        for cn,en in lst:
            if (cn,en) in seen: continue
            seen.add((cn,en)); out.append((cn,en))
        return out
    bank={"A1":dedup_unique(A1)[:100],"A2":dedup_unique(A2)[:100],"B1":dedup_unique(B1)[:100]}
    return bank

ASK_BANK = build_ask_bank()

def gen_ask():
    out={"A1":[],"A2":[],"B1":[]}
    for lvl, pairs in ASK_BANK.items():
        items=[]
        for j,(cn,en) in enumerate(pairs):
            items.append({"id":f"ak_{lvl.lower()}_{j+1:02d}","prompts":[{"cn":cn,"en":en}]})
        out[lvl]=items
    return out

# ===================== 组装 =====================
data={
 "levels":[
   {"k":"A1","d":"起步级 · 简单短句，能听懂、能读、能说单词与极短句"},
   {"k":"A2","d":"进阶级 · 短对话与独白，能组织短语与简单句"},
   {"k":"B1","d":"考试基准级 · 接近广州中考真实语料与要求"},
 ],
 "modules":[
   {"id":"readaloud","name":"模仿朗读","score":"6分",
    "desc":"听范读→准备→录音朗读。A1/A2 短篇渐进，B1 为中考真题长度连贯语篇；攻克吞音、连读、意群停顿、语调。",
    "tasks":gen_readaloud()},
   {"id":"listenchoose","name":"听选信息","score":"9分",
    "desc":"听3段对话（各2遍），每题三选一，口头读出选项，每题8秒作答。",
    "tasks":gen_listenchoose()},
   {"id":"listenanswer","name":"回答问题","score":"6分",
    "desc":"听独白2遍，4道无选项问答题，每题8秒口头回答；用短语/短句，注意时态、单复数。",
    "tasks":gen_listenanswer()},
   {"id":"retell","name":"信息转述","score":"6分",
    "desc":"听短文2遍→读题+准备→60秒复述。要点齐全＞语法完美，用连接词串联。",
    "tasks":gen_retell()},
   {"id":"ask","name":"询问信息","score":"3分",
    "desc":"中文转英文问句：选对疑问词、时态、助动词；一般疑问句句尾升调。每题15秒准备，8秒输出。",
    "tasks":gen_ask()},
 ],
 "official": OFFICIAL,
}

for m in data["modules"]:
    tot=sum(len(m["tasks"][l]) for l in ("A1","A2","B1"))
    print(f"{m['id']:14s} 总 {tot}  (A1={len(m['tasks']['A1'])} A2={len(m['tasks']['A2'])} B1={len(m['tasks']['B1'])})")
    assert tot>=50, f"{m['id']} 不足50"

with open("data.js","w",encoding="utf-8") as f:
    f.write("/* 自动生成：广州中考E听说 分级题库（每题型100关，A1/A2/B1）+ 官方全真模拟真题。由 gen_data.py 生成（v3 含官方真题）。 */\n")
    f.write("const SITE_DATA = ")
    f.write(json.dumps(data, ensure_ascii=False, indent=2))
    f.write(";\n")
print("OK -> data.js")

---
title: 'Game of Life a Webcam and Shadertoy' 
excerpt: 'Camera powered Game of Life' 
coverImage: '/assets/blog/game-of-life/cover.png' 
date: '2022-02-03T21:29:25.315Z' 
author:
    name: Soof Golan 
    picture: '/assets/blog/authors/sg.jfif' 
ogImage:
    url: '/assets/blog/game-of-life/cover.png'
---

## [👾 Try it Live! 👾](https://www.shadertoy.com/view/NtdSRM)

<div dir="rtl">

### מיצבים לברנים 🔥

באופן כללי, לי (ולנתי)
יש בקלוג אינסופי של רעיונות למיצבים אז חשבנו לשם שינוי ללכת על משהו קל להשגה:
להריץ את משחק החיים של
קונווי ([Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life))
.

### משחק החיים - החוקים 

משחק החיים הוא משחק עם מעט מאוד חוקים, ולכן קל לממש את הליבה שלו:

 - 🏨 כל משבצת מוקפת ב-8 משבצות, לכן לכל תא יכולים להיות עד 8 שכנים.
 - ⬜⬅⬛ אם התא חי, ויש לו שכן אחד או שאין לו שכנים כלל, הוא מת מבדידות.
 - ⬜⬅⬛ אם יש לתא יותר משלושה שכנים, הוא מת מצפיפות.
 - ⬛⬅⬜ אם התא מת, ויש לו בדיוק שלושה שכנים, הוא הופך להיות חי ("נולד").
 - ⬜⬅⬜ אחרת (שני שכנים, או שלושה שכנים והתא חי) מצבו לא משתנה.

המימוש הקלאסי הוא עם קונבולוציה עם גרעין (kernel) בגודל 3X3:

</div>

```python
[[1, 1, 1],
[1, 0, 1],
[1, 1, 1]]
```

<div dir="rtl">

קונבולוציה עם הקרנל סוכמת את השכנים, ואז נותר רק לממש את החוקים של לידה והשרדות, המוות זו ברירת המחדל של כל שאר התאים.
אני ממש אהבתי את פשטות המימוש של [ArrayFire](https://github.com/arrayfire/arrayfire#conways-game-of-life-using-arrayfire).

### אינטראקטיביות 

ואז, כמובן שהתחלנו למרכב את הרעיון, רצינו אינטרקאטיביות, והתחלנו לחשוב על ממשק
עם ג'ויסטיק וכפתורים, וניסינו להבין איך בכלל פורסים כזה משחק בשטח.
הגדרנו stretch goal - אם סיימנו עם הכפתורים, עושים אינטגרציה למצלמה.
ישבנו כמה שעות לתכנת
ולא הצלחנו להתקדם לשום מקום משמעותי
השעה הייתה 1 בלילה והיינו קצת אבודים...

### יותר מזל משכל 

ברגע של מזל מוחלט, נזכרתי בכלי מגניב שנקרא [Shadertoy](https://www.shadertoy.com/).
באתר שלהם ניתן ליצור _שיידרים_ (עוד פרטים בהמשך) עם סביבת פיתוח מינימלית, ואינטגרציה עם כל קלט שתרצו: מצלמה, מיקרופון, שעון ועוד.
היינו כל כך תקועים עם המימוש שלנו, שפשוט אמרנו fuck it, ושברנו את הראש איך כותבים את GLSL.

### אז מה לעזאזל זה שיידר ? WTF Is A Shader 

בהפשטה וחסר דיוק משווע, [שיידר דו מימדי](https://en.wikipedia.org/wiki/Shader#Pixel_shaders) זה שם לחתיכת קוד שיודעת לחשב צבע של פיקסל.
השיידר מקבל כמה אינפוטים, קורדינטות, באפרים, זמן, ועוד כמה דברים, ומחשב את הערך של פיקסל בודד.
למה זה טוב? כי במקום לכתוב תוכנה שבה אנחנו מחשבים את כל הפיקסלים אחד אחרי השני, אנחנו יכולים לתת למעבד הגרפי שלנו להריץ את השיידר על מלא פיקסלים במקביל.
כל עוד כתבנו שיידר שפוי, אין חשיבות לאיזה פיקסל מעובד קודם, וזה נותן לנו הרבה חופש, וייתרונות בביצועים של התוכנה שלנו.
בעיקר, ברגע שמתרגלים לכתוב קוד שנוגע רק בפיקסל בודד כל פעם, אנחנו נותנים לruntime להחליט בשבילנו איך לעשות את השאר נכון.

</div>

"Never bet against the compiler." [-- Someone on the Internet](https://quotes.cs.cornell.edu/quote/1244/)

<div dir="rtl">

### איך מחברים תמונה למשחק החיים 

אמ;לק - אלגוריתם סף (Threshold) - הופכים את התמונה לבינארית.
אחרי שהיא בינארית, כל פיקסל מהווה תא חי או מת במשחק החיים

![image thresholding](https://scikit-image.org/docs/dev/_images/sphx_glr_plot_threshold_li_001.png)

</div>

```python
def threshold(image: np.ndarray, val) -> np.ndarray:
    return image - val >= 0
```

<div dir="rtl">

אז כזה, רק בשיידר, וכדי לתפוס קצוות יותר אפשר לעשות עיבוד תמונה נוסף כדי לחדד

</div>

```python
def gaussian_kernel(kernel_size=21, nsig=3):
    x = np.linspace(-nsig, nsig, kernel_size+1)
    kern1d = np.diff(scipy.stats.norm.cdf(x))
    kern2d = np.outer(kern1d, kern1d)
    return kern2d/kern2d.sum()

def gaussian_blur(image: np.ndarray, kernel_size) -> np.ndarray:
    kernel = gaussian_kernel(kernel_size)
    return scipy.signal.convolve2d(image, kernel, 'same')

def sharpen(image: np.ndarray, kernel_size) -> np.ndarray:
    return image - gaussian_blur(image) >= 0
```

<div dir="rtl">

### נו, אז מה נסגר עם זה?

נכון, נכון, היה כאן איפשהו מיצב, לקח לנו בערך שעה לכתוב הכל, shadertoy עשו אינטגרציה מדהימה והכל עבד בלי חיכוך.
בשטח לקחנו את blink64 (מחשב השטח שלי, שאולי יקבל כאן פוסט מתישהו), חיברנו למקרן ומצלמת רשת, והמיצב רץ במשך יומיים באמצע המדבר.

היה מגניב ממש, אנשים נהנו, ואנחנו קצת פישלנו ולא צילמנו **כלום** בשטח

`¯\_(ツ)_/¯`

</div>


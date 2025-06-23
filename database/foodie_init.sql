CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP DEFAULT NOW(),
    activation_date TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INTEGER CHECK (age BETWEEN 1 AND 120),
    sex VARCHAR(10) CHECK (sex IN ('male', 'female')),
    height_cm INTEGER CHECK (height_cm BETWEEN 1 AND 250),
    weight_kg INTEGER CHECK (weight_kg BETWEEN 1 AND 300)
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    calories_per_100g NUMERIC(5,2) CHECK (calories_per_100g >= 0),
    protein_per_100g NUMERIC(5,2) CHECK (protein_per_100g >= 0),
    carbs_per_100g NUMERIC(5,2) CHECK (carbs_per_100g >= 0),
    fat_per_100g NUMERIC(5,2) CHECK (fat_per_100g >= 0),
    diet_category VARCHAR(50),
    prep_time_minutes INTEGER,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id)
);

CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id),
    name VARCHAR(255) NOT NULL,
    calories NUMERIC(5,2),
    protein NUMERIC(5,2),
    carbs NUMERIC(5,2),
    fat NUMERIC(5,2),
    weight_grams NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_goals (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    calories NUMERIC(5,2),
    protein NUMERIC(5,2),
    carbs NUMERIC(5,2),
    fat NUMERIC(5,2),
    water_ml INTEGER
);

CREATE TABLE water_intake (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount_ml INTEGER CHECK (amount_ml >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS verification_tokens_id_seq;
CREATE TABLE IF NOT EXISTS public.verification_tokens
(
    id integer NOT NULL DEFAULT nextval('verification_tokens_id_seq'::regclass),
    token character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT verification_tokens_token_key UNIQUE (token),
    CONSTRAINT verification_tokens_user_id_key UNIQUE (user_id),
    CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.verification_tokens
    OWNER to postgres;

ALTER TABLE meals ADD COLUMN fiber NUMERIC(5,2);
ALTER TABLE meals ADD COLUMN salt NUMERIC(5,2);

ALTER TABLE recipes ADD COLUMN fiber NUMERIC(5,2);
ALTER TABLE recipes ADD COLUMN salt NUMERIC(5,2);

ALTER TABLE recipes ADD COLUMN weight_of_meal INTEGER; 

INSERT INTO recipes VALUES (1, 'Custom meal', 0, 0, 0, 0, null, null, '', '', null, 0, 0, 0);
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (2, 'Chicken Rice Bowl', 242, 239, 19, 26, 5, 4, 13, 'Omnivore', 15, '1 cup uncooked instant rice
1 cup chicken broth
1/2 cup chopped frozen green pepper, thawed
1/4 cup chopped onion
2 teaspoons olive oil
1 package (9 ounces) ready-to-use grilled chicken breast strips
1/2 cup frozen corn, thawed
1/2 cup frozen peas, thawed
1 teaspoon dried basil
1 teaspoon rubbed sage
1/8 teaspoon salt
1/8 teaspoon pepper', 'Cook rice in broth according to package directions. Meanwhile, in a large skillet, saute the green pepper and onion in oil for 2-3 minutes or until crisp-tender. Stir in the chicken, corn, peas, basil and sage. Cook, uncovered, for 4-5 minutes over medium heat or until heated through. Stir in the rice, salt and pepper.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (3, 'Spaghetti and Meatball Skillet Supper', 230, 330, 20, 32, 10, 6, 1, 'Omnivore', 30, '1 tablespoon olive oil
12 ounces frozen fully cooked Italian turkey meatballs
1 can (28 ounces) whole tomatoes, undrained, broken up
1 can (15 ounces) cannellini beans, rinsed and drained
1 can (14 ounces) water-packed quartered artichoke hearts, drained
1/2 teaspoon Italian seasoning
1 can (14-1/2 ounces) reduced-sodium chicken broth
4 ounces uncooked spaghetti, broken into 2-inch pieces (about 1-1/3 cups)
1/4 cup chopped fresh parsley
1 tablespoon lemon juice
Grated Parmesan cheese', '1.In a large skillet, heat oil over medium heat; add meatballs and cook until browned slightly, turning occasionally.
2.Add tomatoes, beans, artichoke hearts, Italian seasoning and broth; bring to a boil. Stir in spaghetti; return to a boil. Reduce heat; simmer, covered, until spaghetti is tender, 10-12 minutes, stirring occasionally.
3.Stir in parsley and lemon juice. Serve with cheese.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (4, 'Shrimp with Orzo and Feta', 215, 406, 33, 31, 1, 9, 8, 'Vege', 25, '1-1/4 cups uncooked whole wheat orzo pasta
2 tablespoons olive oil
2 garlic cloves, minced
2 medium tomatoes, chopped
2 tablespoons lemon juice
1-1/4 pounds uncooked shrimp (26-30 per pound), peeled and deveined
2 tablespoons minced fresh cilantro
1/4 teaspoon pepper
1/2 cup crumbled feta cheese', '1.Cook orzo according to package directions. Meanwhile, in a large skillet, heat oil over medium heat. Add garlic; cook and stir 1 minute. Add tomatoes and lemon juice. Bring to a boil. Stir in shrimp. Reduce heat; simmer, uncovered, until shrimp turn pink, 4-5 minutes.
2.Drain orzo. Add orzo, cilantro and pepper to shrimp mixture; heat through. Sprinkle with feta cheese.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (5, 'Pasta Primavera', 232, 275, 10, 32, 2, 3, 5, 'Vege', 30, '2 cups uncooked gemelli or spiral pasta
1 pound fresh asparagus, trimmed and cut into 2-inch pieces
3 medium carrots, shredded
2 teaspoons canola oil
2 cups cherry tomatoes, halved
1 garlic clove, minced
1/2 cup grated Parmesan cheese
1/2 cup heavy whipping cream
1/4 teaspoon pepper', '1.Cook pasta according to package directions. In a large skillet over medium-high heat, saute asparagus and carrots in oil until crisp-tender. Add tomatoes and garlic; cook 1 minute longer.
2.Stir in Parmesan cheese, cream and pepper. Drain pasta; toss with asparagus mixture.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (6, 'Balsamic Chicken', 240, 245, 21, 6, 1, 0, 11, 'Omnivore', 30, '1/2 cup balsamic vinegar
3 tablespoons extra virgin olive oil
1 tablespoon minced fresh basil
1 tablespoon minced fresh chives
2 teaspoons grated lemon zest
1 garlic clove, minced
3/4 teaspoon salt
1/4 teaspoon pepper
6 boneless skinless chicken thighs (1-1/2 pounds)', '1.Whisk together all ingredients except chicken. In a bowl, toss chicken with 1/3 cup vinegar mixture; let stand 10 minutes.
2.Grill chicken, covered, over medium heat or broil 4 in. from heat until a thermometer reads 170°, 6-8 minutes per side. Drizzle with remaining vinegar mixture before serving.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (7, 'Lettuce-Wrap Burgers', 198, 252, 24, 3, 2, 2, 2, 'Omnivore', 30, '1 pound lean ground beef (90% lean)
1/2 teaspoon salt
1/4 teaspoon pepper
8 Bibb lettuce leaves
1/3 cup crumbled feta cheese
2 tablespoons Miracle Whip Light
1/2 medium ripe avocado, peeled and cut into 8 slices
1/4 cup chopped red onion
Chopped cherry tomatoes, optional', '1.In a large bowl, combine beef, salt and pepper, mixing lightly but thoroughly. Shape into eight 1/2-in.-thick patties.
2.Grill burgers, covered, over medium heat or broil 3-4 in. from heat until a thermometer reads 160°, 3-4 minutes on each side. Place burgers in lettuce leaves. Combine feta and Miracle Whip; spread over burgers. Top with avocado, red onion and, if desired, tomatoes.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (8, 'Lemon-Parsley Baked Cod', 210, 232, 28, 7, 2, 0, 5, 'Vege', 30, '3 tablespoons lemon juice
3 tablespoons butter, melted
1/4 cup all-purpose flour
1/2 teaspoon salt
1/4 teaspoon paprika
1/4 teaspoon lemon-pepper seasoning
4 cod fillets (6 ounces each)
2 tablespoons minced fresh parsley
2 teaspoons grated lemon zest', '1.Preheat oven to 400°. In a shallow bowl, mix lemon juice and butter. In a separate shallow bowl, mix flour and seasonings. Dip fillets in lemon juice mixture, then in flour mixture to coat both sides; shake off excess.
2.Place in a 13x9-in. baking dish coated with cooking spray. Drizzle with remaining lemon juice mixture. Bake 12-15 minutes or until fish just begins to flake easily with a fork. Mix parsley and lemon zest; sprinkle over fish.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (9, 'Grilled Pineapple Chimichurri Chicken', 246, 428, 37, 17, 24, 2, 13, 'Omnivore', 30, '1/2 small sweet red pepper, stemmed and seeded
2 slices fresh pineapple (1/2 inch)
2/3 cup fresh cilantro leaves
2/3 cup parsley sprigs (stems removed)
4 teaspoons lime juice
1/4 cup canola oil
1/4 cup island teriyaki sauce
1 tablespoon minced fresh gingerroot
4 boneless skinless chicken breast halves (6 ounces each)
Hot cooked couscous, optional
2 green onions, sliced
1/4 cup chopped macadamia nuts, toasted', '1.Place pepper and pineapple on an oiled grill rack over medium heat; grill, covered, until lightly browned, 3-4 minutes per side.
2.For chimichurri, place cilantro, parsley and lime juice in a food processor; pulse until herbs are finely chopped. Continue processing while slowly adding oil. Chop grilled pepper and pineapple; stir into herb mixture.
3.Mix teriyaki sauce and ginger. Place chicken on an oiled grill rack over medium heat; grill, covered, until a thermometer reads 165°, 5-7 minutes per side. Brush with some teriyaki mixture during the last 4 minutes.
4.Brush chicken with remaining teriyaki mixture before serving. If desired, serve with couscous. Top with chimichurri, green onions and macadamia nuts.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (10, 'Spinach Quesadillas', 180, 281, 14, 26, 12, 4, 3, 'Vege', 25, '3 ounces fresh baby spinach (about 4 cups)
4 green onions, chopped
1 small tomato, chopped
2 tablespoons lemon juice
1 teaspoon ground cumin
1/4 teaspoon garlic powder
1 cup shredded reduced-fat Monterey Jack cheese or Mexican cheese blend
1/4 cup reduced-fat ricotta cheese
6 flour tortillas (6 inches), warmed
Reduced-fat sour cream, optional', '1.In a large nonstick skillet, cook and stir first 6 ingredients until spinach is wilted. Remove from heat; stir in cheeses.
2.Top half of each tortilla with spinach mixture; fold other half over filling. Place on a griddle coated with cooking spray; cook over medium heat until golden brown, 1-2 minutes per side. Cut quesadillas in half. If desired, serve with sour cream.');
INSERT INTO public.recipes(
	id, name, weight_of_meal, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber, salt, diet_category, prep_time_minutes, ingredients, steps)
	VALUES (11, 'Pesto Vegetable Pizza', 195, 310, 13, 29, 2, 2, 4, 'Vege', 30, '1 prebaked 12-inch thin pizza crust
2 garlic cloves, halved
1/2 cup pesto sauce
3/4 cup packed fresh spinach, chopped
2 large portobello mushrooms, thinly sliced
1 medium sweet yellow pepper, julienned
2 plum tomatoes, seeded and sliced
1/3 cup packed fresh basil, chopped
1 cup shredded part-skim mozzarella cheese
1/4 cup grated Parmesan cheese
1/2 teaspoon fresh or dried oregano', '1.Preheat oven to 450°. Place crust on an ungreased 12-in. pizza pan. Rub cut sides of garlic cloves over crust; discard garlic. Spread pesto sauce over crust. Top with spinach, mushrooms, pepper, tomatoes and basil. Sprinkle with cheeses and oregano.
2.Bake until pizza is heated through and cheese is melted, 10-15 minutes.');

ALTER TABLE public.meals  DROP COLUMN recipe_id;

CREATE TABLE public.history (
    id           serial PRIMARY KEY,
    user_id      integer,
    name         character varying(255)      NOT NULL,
    calories     numeric(5,2),
    protein      numeric(5,2),
    carbs        numeric(5,2),
    fat          numeric(5,2),
    weight_grams numeric(5,2),
    created_at   timestamp without time zone DEFAULT now(),
    fiber        numeric(5,2),
    salt         numeric(5,2),
    CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

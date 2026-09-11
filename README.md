# Landslide Risk Predictor
Upload `index.html`, `style.css`, `script.js`, `model.json`, and `metadata.json` to a GitHub repository and enable GitHub Pages.

The supplied RandomForestClassifier has 200 trees, 10 features, and classes 0/1/2. The browser implementation reproduces tree traversal and averages the leaf probabilities.

Current UI mapping: `0=LOW`, `1=MEDIUM`, `2=HIGH`. Change `R` in `script.js` if the original training labels used a different meaning.

The model is public when hosted on GitHub Pages. Do not use this approach if the model must remain private.

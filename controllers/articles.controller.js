import Article from "../models/article.model.js";

// GET /articles
export const getUserArticles = async (req, res, next) => {
    try {
        const articles = await Article.find({ owner: req.user._id });

        if (!articles.length) {
            return next({ status: 404, message: "No articles found" });
        }

        // enviamos respuesta
        res.send(articles);
    } catch (err) {
        next(err);
    }
};

// POST /articles
export const createArticle = async (req, res, next) => {
    const { keyword, title, text, date, source, link, image } = req.body;

    try {
        const newArticle = await Article.create({
            keyword,
            title,
            text,
            date,
            source,
            link,
            image,
            owner: req.user._id,
        });

        res.status(201).send(newArticle);
    } catch (err) {
        if (err.name === "ValidationError") {
            return next({ status: 400, message: "Invalid data" });
        }

        next(err);
    }
};

// DELETE /articles/:articleId
export const deleteArticle = async (req, res, next) => {
    try {
        const { articleId } = req.params;

        const article = await Article.findById(articleId).select("+owner");

        if (!article) {
            return next({ status: 404, message: "Article not found" });
        }

        if (article.owner.toString() !== req.user._id.toString()) {
            return next({
                status: 403,
                message: "You are not the owner of this article",
            });
        }

        await Article.findByIdAndDelete(articleId);

        res.send(article);
    } catch (err) {
        if (err.name === "CastError") {
            return next({ status: 400, message: "Invalid id" });
        }

        next(err);
    }
};

import Article from "../models/article.js";

// GET /articles
export const getUserArticles = async (req, res, next) => {
    try {
        // busca artículos que le pertenecen al usuario. (req.user) <- Middleware
        const articles = await Article.find({ owner: req.user._id });

        if (!articles.length) {
            // -> si el array está vacío, responde con 404
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
        // .create() hace las dos cosas en un solo paso:
        // construye el objeto Y lo guarda en la BD
        const newArticle = await Article.create({
            keyword,
            title,
            text,
            date,
            source,
            link,
            image,
            owner: req.user._id, // <- viene del token via middleware
        });

        res.status(201).send(newArticle); // lo envia como response
    } catch (err) {
        // datos inválidos o faltantes
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

        // const deletedArticle = await Article.findByIdAndDelete(articleId);

        // El problema es que findByIdAndDelete borra y busca en un solo paso,
        // entonces no puedes verificar el dueño ANTES de borrar.

        // paso 1: busca el artículo sin borrarlo
        const article = await Article.findById(articleId);

        if (!article) {
            return next({ status: 404, message: "Article not found" });
        }

        // paso 2: verifica que el usuario es dueño del artículo

        // ¿Por qué .toString()? .. Ambos son ObjectId de MongoDB, no son strings simples,
        // los conviertes a string para leerlos
        if (article.owner.toString() !== req.user._id.toString()) {
            return next({
                status: 403,
                message: "You are not the owner of this article",
            });
        }

        // paso 3: si es el dueño, borra el artículo
        await Article.findByIdAndDelete(articleId);

        res.send(article);
    } catch (err) {
        // id con formato inválido
        if (err.name === "CastError") {
            return next({ status: 400, message: "Invalid id" });
        }

        next(err);
    }
};

// Cada vez que llega un pedido al servidor, es una conversación nueva desde cero. El servidor no recuerda lo que hizo en el pedido anterior.
// Cada función recibe su propio REQ con su propia info, y tiene que extraer lo que necesita por su cuenta.

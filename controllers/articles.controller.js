// import Article from "../models/article.js";

// export const createArticle = async (req, res, next) => {
//     try {
//         const { keyword, title, text, date, source, link, image } = req.body;

//         const owner = req.user._id;

//         const article = await Article.create({
//             keyword,
//             title,
//             text,
//             date,
//             source,
//             link,
//             image,
//             owner,
//         });

//         res.send(article);
//     } catch (err) {
//         return next(err);
//         // res.status(500).send({ message: error.message });
//     }
// };

export const ping = (req, res) => {
    res.json({
        message: "pong",
        status: "ok",
    });
};

const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.findAll();

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: docs,
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const id = req.params.id;
        const doc = await Model.destroy({ where: { id: id } });

        if (!doc) {
            return next(new AppError('No document in this ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

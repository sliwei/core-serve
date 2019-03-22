/*
 lw 数据库数据处理
 */
const mysql = require('./connection');

/**
 * lw 表查询
 * @param tablename 表名
 * @returns {Promise} 该表所有列
 */
const findAll = function (tablename) {
    return new Promise(function (resolve, reject) {
        var sql = 'select * from ??';
        mysql.execQuery(sql, [tablename], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
};

/**
 * lw 查询
 * @param tablename 表
 * @param require 条件
 * @returns {Promise} 返回
 */
const find = function (tablename, require) {
    return new Promise(function (resolve, reject) {
        var sql = 'select * from ?? where ?';
        mysql.execQuery(sql, [tablename, require], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
};

/**
 * lw 修改表的字段
 * @param tablename 表
 * @param one 修改值
 * @param twe 条件
 * @returns {Promise} 修改状态
 */
const update = function (tablename, one, twe) {
    return new Promise(function (resolve, reject) {
        var sql = 'update ?? set ? where ?';
        mysql.execQuery(sql, [tablename, one, twe], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
};

/**
 * lw 自定义sql,遵循mysql原生语法(关键字表名用`包裹)
 * @param sql
 * @returns {Promise}
 */
const op = function (sql) {
    return new Promise(function (resolve, reject) {
        mysql.execQuery(sql, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
};

/**
 * lw 分页
 * @param tabName 表名
 * @param field 查询字段
 * @param page 页码
 * @param num 条数
 * @param order 叙
 * @returns {Promise}
 */
const findLimit = (tabName, field = ['*'], page, num, order) => {
    return new Promise(function (resolve, reject) {
        let count_sql = 'select count(id) as total from ' + tabName + ' where is_del = 0';
        mysql.execQuery(count_sql, [], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                // resolve(rows);
                let total = rows[0].total;
                let red = (page * num) - num;
                let mon_sql = `select ${field.toString()} from ${tabName} where is_del = 0 ${order && 'order by id desc'} limit ${red}, ${num}`;
                mysql.execQuery(mon_sql, [], function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        let dat = {
                            pageIndex: page,
                            pageSize: num,
                            pageCount: Math.ceil(total/num),
                            total: total,
                            list: rows
                        };
                        resolve(dat);
                    }
                });
            }
        });
    })
};

module.exports = {
    findAll: findAll,
    find: find,
    update: update,
    op: op,
    findLimit: findLimit,
};

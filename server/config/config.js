// Backward-compatibility bridge for any legacy references
const mongoose = require('mongoose');

module.exports = {
  connection: mongoose.connection,
};

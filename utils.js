String.prototype.escapeHtml = function() {
    try {
        return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    } catch(e) {
        return ''
    }
}

String.prototype.parseInt = function() {
    return parseInt(this)
}

String.prototype.removeSubstr = function(to_remove) {
    return this.replace(to_remove, '')
}

String.prototype.removeAll = function(to_remove) {
    return this.replace(new RegExp(to_remove, 'g'), '')
}

String.prototype.circum = function(length = 10) {
    const newString = this.substring(0, length)

    return newString + (this !== newString ? "…" : "")
}

String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Object.prototype.merge = function(another) {
    return Object.assign({}, this, another);
}

Array.prototype.sum = function() {
    let sum = 0
    this.forEach(num => {
        sum += parseFloat(num)
    })

    return sum
}

Array.prototype.sortNumeric = function() {
    return this.sort(function(a, b) {return a - b})
}

Array.prototype.sortByHeight = function() {
    return this.sort(function (a, b) {
        if(a.height > b.height) {
            return -1;
        }

        if(a.height < b.height) {
            return 1;
        }

        return 0
    })
}

Array.prototype.isEqual = function(another_array) {
    return this.toString() == another_array.toString()
}

var Food = function(name) {

    this.name = name;
    this.makeQ = function(){

        this.q = [this];
        this.q.push(Food("eggs"));
    }

}

f = new Food("spam")
f.makeQ()
console.log(f.q)
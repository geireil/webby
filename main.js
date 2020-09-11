let array = [1,2,3];
let y = (...args) => {
  return arr.map((value,index) => value*args[index]);
};

y(2,4,5) // 2 8 15
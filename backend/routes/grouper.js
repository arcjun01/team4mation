const { students, settings } = require("../data/students");


const { males, others } = seperateGenders();
// console.log(males)
// console.log(males.length)
// console.log(others)
// console.log(others.length)

// const maxMaleNum = Math.floor(settings.teamSize / 2)
// const groupNum = Math.floor(settings.classSize / settings.teamSize)
// const testDataLength = Math.floor(students.length / settings.teamSize);
// console.log(maxMaleNum);
// console.log(groupNum);
// console.log(testDataLength);

// const groups = [];

for (let i = 0; i < testDataLength; i++) {
    const group = [];

}

function seperateGenders() {
    const males = []
    const others = []

    for (const person of students) {
        if (person.gender === "Male") males.push(person);
        if (person.gender === "Female" || person.gender === "Other") others.push(person)
    }

    return { males, others };
}
const studentData = require("../data/students.js")
const { students, settings } = studentData

function grouper() {
    const groupNum = Math.floor(settings.classSize / settings.teamSize)
    const testDataLength = Math.floor(students.length / settings.teamSize);
    console.log(groupNum);
    console.log(testDataLength);

    const { males, others } = seperateGenders();
    console.log(males)
    console.log(males.length)
    console.log(others)
    console.log(others.length)

    const groups = makeBasicGroups(males, others, groupNum);

    console.log(groups);


    function seperateGenders() {
        const males = []
        const others = []

        for (const person of students) {
            if (person.gender === "Male") males.push(person);
            if (person.gender === "Female" || person.gender === "Other") others.push(person)
        }

        return { males, others };
    }
}



function makeBasicGroups(males, others, groupNum) {
    const groups = [];
    const maxMaleNum = Math.floor(settings.teamSize / 2)

    for (let i = 0; i < groupNum; i++) {
        const group = [];

        const malesAdded = Math.min(maxMaleNum, males.length);
        for (let j = 0; j < malesAdded; j++) {
            group.push(males.pop());
        }

        while (group.length < settings.teamSize) {
            //if (others.length === 0) return null; // impossible to form groups
            group.push(others.pop());
        }

        groups.push(group)
    }

    return groups;
}

module.exports = grouper;
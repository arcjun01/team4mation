const studentData = require("../data/students.js")
const { students, settings } = studentData

function grouper() {
    const groupNum = Math.ceil(students.length / settings.teamSize);
    const { males, others } = seperateGenders();
    const groups = makeBasicGroups(males, others, groupNum);

    return groups;
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

function makeBasicGroups(males, others, groupNum) {
    const groups = Array.from({ length: groupNum }, () => []);


    let i = 0;
    for (const person of males) {
        const index = findAvailableTeam(i, groups, groupNum)
        if (index !== -1) {
            groups[index].push(person)
            i = (index + 1) % groupNum;
        }
    }

    i = 0;
    for (const person of others) {
        const index = findAvailableTeam(i, groups, groupNum)
        if (index !== -1) {
            groups[index].push(person)
            i = (index + 1) % groupNum;
        }
    }

    return groups;
}

function findAvailableTeam(startIndex, groups, groupNum) {
    let checked = 0;
    let i = startIndex;

    while (checked < groupNum) {
        if (groups[i].length < settings.teamSize) {
            return i;
        }
        i = (i + 1) % groupNum;
        checked++;
    }
    return -1;
}

module.exports = grouper;
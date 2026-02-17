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

    // Sort each gender group by GPA
    males.sort((a, b) => a.gpa - b.gpa);
    others.sort((a, b) => a.gpa - b.gpa);

    let maleIndex = 0;
    let otherIndex = 0;

    for (let g = 0; g < groupNum; g++) {

        // Add up to 2 males
        for (let m = 0; m < 2 && maleIndex < males.length; m++) {
            groups[g].push(males[maleIndex++]);
        }

        // Add up to 2 others
        for (let o = 0; o < 2 && otherIndex < others.length; o++) {
            groups[g].push(others[otherIndex++]);
        }
    }

    // If any leftovers remain, fill remaining spots
    while (maleIndex < males.length) {
        for (let g = 0; g < groupNum && maleIndex < males.length; g++) {
            if (groups[g].length < settings.teamSize) {
                groups[g].push(males[maleIndex++]);
            }
        }
    }

    while (otherIndex < others.length) {
        for (let g = 0; g < groupNum && otherIndex < others.length; g++) {
            if (groups[g].length < settings.teamSize) {
                groups[g].push(others[otherIndex++]);
            }
        }
    }

    return groups;
    // const groups = Array.from({ length: groupNum }, () => []);



    // let i = 0;
    // for (const person of males) {
    //     const index = findAvailableTeam(i, groups, groupNum)
    //     if (index !== -1) {
    //         groups[index].push(person)
    //         i = (index + 1) % groupNum;
    //     }
    // }

    // i = 0;
    // for (const person of others) {
    //     const index = findAvailableTeam(i, groups, groupNum)
    //     if (index !== -1) {
    //         groups[index].push(person)
    //         i = (index + 1) % groupNum;
    //     }
    // }

    // return groups;
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
function grouper(students, teamSize) {
    if (!students || students.length === 0) return [];
    
    const groupNum = Math.ceil(students.length / teamSize);
    
    // Pass the students array into the helper function
    const { males, others } = seperateGenders(students); 
    const groups = makeBasicGroups(males, others, groupNum, teamSize);

    return groups;
}

// Accept studentsList as a parameter
function seperateGenders(studentsList) {
    const males = [];
    const others = [];

    // Use studentsList to match the parameter above
    for (const person of studentsList) {
        if (person.gender && person.gender.toLowerCase() === "male") {
            males.push(person);
        } else {
            others.push(person);
        }
    }
    return { males, others };
}

function makeBasicGroups(males, others, groupNum, teamSize) {
    const groups = Array.from({ length: groupNum }, () => []);

    let i = 0;
    // Fill with males first to distribute them
    for (const person of males) {
        const index = findAvailableTeam(i, groups, groupNum, teamSize);
        if (index !== -1) {
            groups[index].push(person);
            i = (index + 1) % groupNum;
        }
    }

    // Fill remaining spots with others
    for (const person of others) {
        const index = findAvailableTeam(i, groups, groupNum, teamSize);
        if (index !== -1) {
            groups[index].push(person);
            i = (index + 1) % groupNum;
        }
    }

    return groups;
}

function findAvailableTeam(startIndex, groups, groupNum, teamSize) {
    let checked = 0;
    let i = startIndex;

    while (checked < groupNum) {
        if (groups[i].length < teamSize) {
            return i;
        }
        i = (i + 1) % groupNum;
        checked++;
    }
    return -1;
}

module.exports = grouper;
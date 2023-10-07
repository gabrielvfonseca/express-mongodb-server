const found = members.some(member => member.id == parseInt(req.params.id));

if (found) {
    const updMember = req.body;
    members.forEach(member => {
        if (member.id === parseInt(req.params.id)) {
            member.name = updMember.name ? updMember.name : member.name;
            member.email = updMember.email ? updMember.email : member.email;
        }
    });
    res.json({
        msg: "Member updated",  
    });
}
else {
    // 200 => OK; 400 => Bad Request;
    res.status(400).json({
        msg: `Member with the id ${req.params.id}, not found!`
    });
}


// Delete Member
router.delete("/:id", (req, res) => {
    const found = members.some(member => member.id == parseInt(req.params.id));

    if (found) {
        res.json({
            msg: "Member deleted", 
            member: members.filter(member => member.id !== parseInt(req.params.id))
        });
    }
    else {
        // 200 => OK; 400 => Bad Request;
        res.status(400).json({
            msg: `Member with the id ${req.params.id}, not found!`
        });
    }
});

// Get simple Member
router.get("/:id", (req, res) => {
    const found = members.some(member => member.id == parseInt(req.params.id));

    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    }
    else {
        // 200 => OK; 400 => Bad Request;
        res.status(400).json({
            msg: `Member with the id ${req.params.id}, not found!`
        });
    }
});


// Gets all Members
router.get("/", (req, res) => {
    res.json(members);
});
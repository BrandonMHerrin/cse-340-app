const deleteInquiry = async (inquiry_id) => {
  console.log(`Delete inquiry: ${inquiry_id}`);
  try {
    const result = await fetch(`/inv/inquiry/${inquiry_id}`, {
      method: "DELETE",
    });
    if (result) {
        document.location.reload();
    }
  } catch (error) {
    console.error(error.message);
  }
};

const renderInquiries = (inquiries) => {
  const inquiriesTableWrapper = document.querySelector(
    "#inquiries-table-wrapper"
  );
  if (inquiries.length !== 0) {
    const table = document.createElement("table");
    table.setAttribute("id", "inquiries-table");
    table.innerHTML = `<thead>
            <tr>
                <td>Id</td>
                <td>First</td>
                <td>Last</td>
                <td>Phone</td>
                <td>Email</td>
                <td>Message</td>
                <td></td>
            </tr>
            </thead>`;
    const tbody = document.createElement("tbody");
    inquiries.forEach((inquiry) => {
        const tr = document.createElement('tr');
        const idTd = document.createElement('td');
        idTd.innerText = inquiry.inquiry_id;
        tr.appendChild(idTd);
        const fnameTd = document.createElement('td');
        fnameTd.innerText = inquiry.inquiry_firstname;
        tr.appendChild(fnameTd);
        const lnameTd = document.createElement('td');
        lnameTd.innerText = inquiry.inquiry_lastname;
        tr.appendChild(lnameTd);
        const phoneTd = document.createElement('td');
        phoneTd.innerText = inquiry.inquiry_phone;
        tr.appendChild(phoneTd)
        const emailTd = document.createElement('td');
        emailTd.innerText = inquiry.inquiry_email;
        tr.appendChild(emailTd);
        const messageTd = document.createElement('td');
        messageTd.innerText = inquiry.inquiry_message;

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute("class", "btn");
        deleteButton.onclick(deleteInquiry(inquiry_id))
        
    })
    inquiriesTableWrapper.appendChild(table);
  }
};

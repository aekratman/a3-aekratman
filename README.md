# Musical Character Archive

**Glitch Link:** [Musical Character Archive](http://a3-abigail-kratman.glitch.me)

This application is meant to store an archive of musical theatre characters, with important high-level information stored (including names, solo song count, and the musical they originated in). Each account holds a different archive and can be accessed only with the correct username and password.

I struggled with mitigating the database management portion of this project, especially dealing with the server-side methods of mitigating which accounts can log in when. I chose session-based authentication as it seemed the most intuitive to implement and to use.

I used Bootstrap for the CSS framework as it felt like the most useful framework to dive into learning. I wrote some custom vanilla CSS as it allowed me to worry about the accessibility of the site in a way I had worked with before.

## Design/Evaluation Achievements

### Design Achievement 1: W3C Web Accessibility Initiative

- **Provide informative, unique page titles**  
  Each page title notes the use of the page along with the site’s general use: the Musical Character Archive homepage and the Musical Character Archive’s Login/Register page.

- **Help users avoid and correct mistakes**  
  All actions on both server and client side have clear error messages for any issue that may arise, along with written instructions.

- **Use headings and spacing to group related content**  
  The headings have been grouped carefully to avoid any confusion and to note instructions.

- **Associate a label with every form control**  
  Within the HTML, all of the form controls are labeled (see `login.handlebars`).

- **Provide clear instructions**  
  All of the actions possible on the app have instructions noted next to them in order to make the process intuitive.

- **Provide sufficient contrast between foreground and background**  
  The colors were picked to clarify the background and foreground while being contrasting enough for colorblind individuals.

- **Ensure that all interactive elements are keyboard accessible**  
  All elements are accessible through keyboard, screen readers, etc.

- **Ensure that interactive elements are easy to identify**  
  All buttons and login features are noted as such and stand out from the static elements.

- **Use mark-up to convey meaning and structure**  
  The markup in both HTML pages conveys meaning (with the label, meta, containers, etc.) of each element. The code is formatted clearly.

- **Ensure that form elements include clearly associated labels**  
  All form elements are labeled with what they represent.

- **Keep content clear and concise**  
  All content is clear in written word and documented with comments in code.

- **Reflect the reading order in the code order**  
  All the markup and code present in the project go in an intuitive order.

### Design Achievement 2: CRAP Principles

- **Contrast**  
  Contrast was an important consideration in the creation of this site. The pages are made with clear attention given to the foreground over the background. The forms stand out in comparison to the static elements, allowing them to be readable. When you hover over any part of the table entries, it highlights to contrast it against the non-hovered entries. Each of the different parts of the text (headers, instructions, login confirmation) is sized differently in order to pull attention to the most important part of the pages (title, instructions, and confirmation of your username). The forms are distinct against the wider page, as it takes up a large centralized (eye-catching) portion and hosts the brightest colors on the site. This allows user eyes to be drawn to the most important points of the page.

- **Repetition**  
  The form holds several repetitive elements (each “entry” for the table—name, musical, songs) in order to make it clear to all users that each element is used the same way (filled in for a given entry). Everything is given the same amount of margin space to create a more cohesive space design. It is a simple interface that does not deviate from patterns in order to feel predictable and unified for all users. This is why the login page and post-login content (including the table) has similar methods of spacing, similar fonts, and similar coloring. The pattern of these designs has already been worked with to be clear and accessible. With it all following the same theme, there is no need to worry about appearance.

- **Alignment**  
  Alignment, at its core, is what allows a page to look professional and well-designed. The site follows a fresh, clear, and clean design which centers content when necessary to draw eyes to what is important. All text is aligned similarly, and each element falls into a clear grid with established margins in order to connect them to each other. This was done with Bootstrap and vanilla CSS in order to allow the pages to remain clearly defined. The importance of alignment is also clear as, in addition to clear design choices, it also defines the hierarchy of instructions and usage within both the form and the wider website (in terms of logging into your account). Alignment is a deeply important topic in any form of front-end design and was considered heavily in the process of application creation.

- **Proximity**  
  Proximity mitigates, once again, the hierarchy of the application’s abilities and uses. These methods of grouping allow a page to feel less overwhelming and more cohesive. Both textually and within markup text (the actual HTML documents), the text and/or code is organized in careful groups, separated and delineated clearly by both spacing and comments/instructions. This structure allows a user to work with the application without confusion and with clear intuitive methods. This also allows other programmers to more easily delve into the programming of the site and update/add new things without breaking any pre-existing functions and design choices. This is the final design principle to follow, which allows for the easy evolution of the application, especially with more complex and lengthy code snippets, such as those found within the server side of this application.

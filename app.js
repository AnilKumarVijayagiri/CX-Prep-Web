const PREP_CONFIG = window.PREP_CONFIG || {};
let hasBackendConfig = Boolean(PREP_CONFIG.supabaseUrl && PREP_CONFIG.supabaseAnonKey);
const demoRoadmaps = [
  {
    id: "sample-python-fullstack",
    slug: "python-full-stack-interview-prep",
    title: "Python Full-Stack Developer",
    track: "Full-stack",
    level: "Entry to intermediate",
    duration_days: 15,
    summary: "A focused 15-day interview sprint across HTML, CSS, JavaScript, Python, FastAPI, and PostgreSQL. Learn the foundations, explain your decisions, and build a small working product.",
    skills: ["HTML & CSS", "JavaScript", "Python", "FastAPI", "PostgreSQL"],
    published: true,
    content: {
      days: [
        { title: "HTML foundations", focus: "Semantic structure and accessible markup", concepts: ["Semantic elements", "Document outline", "Accessibility basics"], notes: "HTML describes the meaning and structure of content. Prefer elements such as <header>, <main>, <nav>, and <article> when their meaning fits; semantic markup helps browsers, assistive technology, and other developers understand the page.\n\nA useful interview answer explains why semantics matter, not only which tags exist. Mention keyboard navigation, labels, and meaningful heading order when discussing accessible forms and page structure.", questions: [{ question: "What is semantic HTML?", answer: "It uses elements that communicate the role of their content, such as <nav> for navigation and <main> for primary content. This improves accessibility, document structure, and maintainability." }, { question: "Why should a page have one main landmark?", answer: "It identifies the primary content region so assistive technology users can navigate directly to it. Keep repeated navigation, sidebars, and footers outside that main region." }], tasks: [{ title: "Structure a profile page", detail: "Create a page with a header, navigation, main profile article, skills list, and footer. Use a logical heading hierarchy." }, { title: "Audit a form", detail: "Add labels, required-field hints, and clear button text to a contact form. Test it using only the keyboard." }] },
        { title: "Forms and browser behavior", focus: "Native controls, validation, and useful user feedback", concepts: ["Labels and controls", "Input types", "Native validation"], notes: "Native form controls provide keyboard behavior and validation that custom controls must otherwise recreate. Associate each label with its input using matching for and id values. Choose input types such as email, url, and number to give users better keyboards and browsers useful constraints.\n\nClient validation improves feedback, but the server must validate again because client-side rules can be bypassed.", questions: [{ question: "What is the difference between GET and POST for forms?", answer: "GET sends form values as part of the URL and is appropriate for safe, shareable queries. POST sends values in the request body and is used when submitting data that changes or creates server-side state." }, { question: "Why is server-side validation still required?", answer: "A user can disable or bypass browser validation and send a request directly. The server is the trusted boundary and must validate every incoming value." }], tasks: [{ title: "Build a validated signup form", detail: "Use semantic labels and appropriate input types. Add a clear success state and test empty and malformed inputs." }, { title: "Explain a form submission", detail: "Trace the browser request from submit event through payload, server validation, and response." }] },
        { title: "CSS foundations", focus: "Cascade, specificity, and maintainable styling", concepts: ["Cascade and inheritance", "Specificity", "Box model"], notes: "CSS resolves competing declarations through origin, importance, cascade layer, specificity, and source order. Keep selectors simple so a component can be changed without fighting a chain of overrides.\n\nThe box model determines how content, padding, borders, and margins contribute to layout. Setting box-sizing: border-box makes declared widths include padding and border, which usually makes sizing more predictable.", questions: [{ question: "How does CSS specificity work?", answer: "When declarations have equal cascade priority, selectors with greater specificity win. If specificity is also equal, the later declaration wins. Prefer small, intentional selectors over escalating specificity." }, { question: "What does box-sizing: border-box change?", answer: "The declared width and height include the content, padding, and border, rather than only the content box." }], tasks: [{ title: "Style a content panel", detail: "Create a reusable panel with spacing, border, and responsive width. Use border-box sizing and avoid ID selectors." }, { title: "Resolve a cascade conflict", detail: "Inspect two conflicting rules in DevTools, identify the winning declaration, then simplify the selectors." }] },
        { title: "Responsive layout", focus: "Flexbox, grid, and small-screen decisions", concepts: ["Flexbox", "CSS Grid", "Responsive breakpoints"], notes: "Flexbox is suited to arranging items along one primary axis; Grid is suited to layouts with rows and columns. Use intrinsic sizing and flexible tracks so content can adapt before adding breakpoints.\n\nA responsive design is not simply a desktop layout scaled down. Identify which content needs a different order, density, or navigation pattern on narrow screens, and test at the point where the layout actually stops working.", questions: [{ question: "When would you choose Grid over Flexbox?", answer: "Choose Grid when both rows and columns need coordinated sizing. Choose Flexbox when items primarily flow along a single axis, with wrapping or distribution." }, { question: "What is a mobile-first breakpoint strategy?", answer: "Start with constraints that work on narrow screens, then add layout changes when the content needs more room. Breakpoints should follow the design rather than a fixed device list." }], tasks: [{ title: "Build a responsive card grid", detail: "Use CSS Grid with flexible columns that collapse naturally. Check for long titles and narrow widths." }, { title: "Test a navigation layout", detail: "Decide how navigation changes on small screens and verify the focus order remains sensible." }] },
        { title: "JavaScript core", focus: "Values, scope, functions, and predictable code", concepts: ["Primitive values", "Scope and closures", "Functions"], notes: "JavaScript values have types, and variables declared with const cannot be reassigned while let bindings can. Prefer const by default and use let when reassignment is part of the logic. Avoid var in modern code because its function-scoped behavior can make control flow harder to reason about.\n\nFunctions create reusable behavior. A closure retains access to its lexical environment, which is useful for private state and callbacks; explain the captured value in context rather than relying on a memorized definition.", questions: [{ question: "What is the difference between let and const?", answer: "Both are block-scoped. A const binding cannot be reassigned, while a let binding can. Objects held by a const variable can still be mutated unless the object is separately protected." }, { question: "What is a closure?", answer: "A function together with access to the lexical variables in scope when it was created. It lets callbacks retain the state they need after the outer function has returned." }], tasks: [{ title: "Write a pure formatter", detail: "Create a function that converts a list of names into a normalized display format without mutating its input." }, { title: "Trace scope in a callback", detail: "Write a small closure that remembers a counter and explain which invocation changes its value." }] },
        { title: "DOM and events", focus: "Update the interface in response to user actions", concepts: ["DOM selection", "Event listeners", "Event bubbling"], notes: "The DOM represents a document as objects that JavaScript can inspect and update. Select elements with stable, meaningful selectors and attach event listeners rather than inline event attributes.\n\nEvents bubble from the target toward its ancestors. Event delegation uses this behavior by placing one listener on a parent and checking the event target, which is useful for lists whose items are created dynamically.", questions: [{ question: "What is event delegation?", answer: "A parent handles events from matching descendants through bubbling. It reduces per-item listeners and naturally supports descendants added later." }, { question: "What is the difference between target and currentTarget?", answer: "target is the element where the event originated. currentTarget is the element whose listener is currently running." }], tasks: [{ title: "Create a filterable list", detail: "Render a list from data, add a search field, and update the visible results without reloading the page." }, { title: "Use event delegation", detail: "Add one click listener to a list container and handle actions from its child buttons." }] },
        { title: "Async JavaScript and HTTP", focus: "Promises, fetch, and loading/error states", concepts: ["Promises", "async/await", "HTTP status codes"], notes: "A Promise represents the eventual outcome of an asynchronous operation. async/await makes promise-based code easier to read, but it does not make the operation synchronous; errors should be handled with try/catch and the interface should represent loading and failure states.\n\nfetch resolves when a response arrives, including for HTTP error statuses. Check response.ok before treating the body as successful, and send only the data the endpoint expects.", questions: [{ question: "Does fetch reject on a 404 response?", answer: "No. fetch generally resolves with a Response for HTTP error statuses. Check response.ok or response.status and handle unsuccessful responses explicitly." }, { question: "How do you explain async/await?", answer: "It is syntax for working with promises. Await pauses that async function until a promise settles, while the JavaScript runtime can continue other work." }], tasks: [{ title: "Fetch and render a resource", detail: "Show a loading state, render a successful response, and display a useful message for network and HTTP errors." }, { title: "Inspect an HTTP exchange", detail: "Use browser tools to identify request method, status, headers, and response body." }] },
        { title: "Python essentials", focus: "Readable syntax, data types, and functions", concepts: ["Lists and dictionaries", "Functions", "Comprehensions"], notes: "Python emphasizes readable code and has built-in collections such as lists, tuples, sets, and dictionaries. Choose the collection based on the operations and uniqueness requirements, not only familiarity.\n\nFunctions should have a clear purpose and predictable inputs and outputs. Use comprehensions for straightforward transformations, but expand them into loops when nesting makes the logic difficult to read.", questions: [{ question: "When do you use a tuple instead of a list?", answer: "A tuple communicates a fixed collection of values and is immutable. Use a list when the collection needs to grow, shrink, or be updated." }, { question: "What is the difference between == and is?", answer: "== compares values for equality. is checks whether two references point to the same object; use it for identity checks such as value is None." }], tasks: [{ title: "Summarize interview results", detail: "Write a function that accepts a list of scores and returns count, average, and top score. Handle an empty list." }, { title: "Normalize a list of records", detail: "Use a dictionary keyed by a stable identifier and explain how duplicate keys are handled." }] },
        { title: "Python structure and errors", focus: "Modules, classes, exceptions, and testable code", concepts: ["Modules and imports", "Classes", "Exception handling"], notes: "Python modules organize code and define a namespace. Keep modules cohesive and avoid circular imports by placing shared concepts at a lower, stable layer.\n\nExceptions should represent exceptional conditions and be handled at a boundary that can recover or provide context. Catching every exception can hide defects; catch specific errors when the code can take a meaningful action.", questions: [{ question: "When should you create a class in Python?", answer: "Use a class when related state and behavior form a meaningful object or abstraction. A small stateless operation may be clearer as a function." }, { question: "Why avoid a bare except?", answer: "It can catch conditions the code cannot safely recover from and conceal programming errors. Catch the specific exception types you expect and handle them deliberately." }], tasks: [{ title: "Model a support ticket", detail: "Create a small Ticket class or dataclass with validation and a readable representation." }, { title: "Handle a parsing error", detail: "Parse user input, catch the expected conversion error, and return a clear validation message." }] },
        { title: "SQL and relational data", focus: "Model data and write useful queries", concepts: ["Tables and keys", "JOIN", "Indexes"], notes: "Relational databases organize records into tables with constraints. A primary key identifies a row; foreign keys express relationships and help preserve referential integrity.\n\nJOIN combines related rows. Indexes can speed up reads for matching access patterns but consume storage and add work to writes, so index columns based on actual queries and verify plans when performance matters.", questions: [{ question: "What is the difference between a primary key and a foreign key?", answer: "A primary key uniquely identifies a row in its table. A foreign key references a key in another table to represent and enforce a relationship." }, { question: "When can an index hurt?", answer: "Indexes consume storage and must be maintained on writes. Too many or poorly chosen indexes can slow inserts and updates without helping the important queries." }], tasks: [{ title: "Design a task schema", detail: "Create users and tasks tables with primary keys, a foreign key, timestamps, and a clear ownership relationship." }, { title: "Query an overview", detail: "Write a query that joins tasks to owners and filters to incomplete tasks ordered by creation time." }] },
        { title: "FastAPI and API design", focus: "Routes, Pydantic models, and useful responses", concepts: ["Path operations", "Pydantic models", "HTTP methods"], notes: "FastAPI maps Python functions to HTTP path operations. Pydantic models validate and serialize request and response data, while type hints help document and validate the interface.\n\nChoose HTTP methods and status codes according to the operation. Keep request schemas separate from database models when their responsibilities differ, and return errors that help clients correct their request without leaking internals.", questions: [{ question: "What does Pydantic do in a FastAPI application?", answer: "It validates and serializes data using declared models and types. FastAPI uses those models for request parsing and OpenAPI documentation." }, { question: "When would you return 201 instead of 200?", answer: "201 Created is appropriate when a request successfully creates a resource. 200 OK is a general success response where no more specific status is needed." }], tasks: [{ title: "Create a task API", detail: "Implement list and create endpoints with request and response models and appropriate status codes." }, { title: "Validate API input", detail: "Add required fields and constraints, then inspect the validation response for invalid payloads." }] },
        { title: "REST patterns and API quality", focus: "Consistent resources, errors, and documentation", concepts: ["Resource naming", "Status codes", "OpenAPI"], notes: "A REST-style API models resources with stable URLs and uses HTTP methods to express operations. Consistency matters: clients should not need to guess whether an endpoint returns one shape or another.\n\nFastAPI generates OpenAPI documentation from route declarations and schemas. Treat the generated schema as part of the interface: review names, descriptions, response types, and error behavior as carefully as implementation code.", questions: [{ question: "Why use a response model?", answer: "It defines the public output shape, validates returned data, and can prevent internal fields from being exposed accidentally." }, { question: "What is idempotency?", answer: "An operation is idempotent when repeating it has the same intended effect as doing it once. GET, PUT, and DELETE are defined as idempotent in HTTP semantics, though implementation details still matter." }], tasks: [{ title: "Document an endpoint", detail: "Add a clear summary, parameter descriptions, response model, and a documented error case." }, { title: "Standardize API errors", detail: "Design a consistent error response and test missing, malformed, and unauthorized requests." }] },
        { title: "Connect the frontend and API", focus: "CORS, JSON, and end-to-end behavior", concepts: ["CORS", "JSON payloads", "End-to-end flow"], notes: "A browser enforces same-origin rules. Cross-Origin Resource Sharing lets a server explicitly allow browser requests from other origins; configure only the origins and methods the app needs rather than using a wildcard by habit.\n\nThe frontend should map server responses into clear interface states. Keep API calls in a small client layer so request details, error handling, and authentication headers are not scattered across components.", questions: [{ question: "What problem does CORS solve?", answer: "It lets a server declare which browser origins may read its responses. It is enforced by browsers and does not replace server-side authentication or authorization." }, { question: "Where should API error handling live?", answer: "Shared transport failures can be normalized in an API client, while each screen decides how to present errors that are meaningful to its workflow." }], tasks: [{ title: "Connect a task form", detail: "Submit JSON to your API, disable the submit action while pending, and show success or validation feedback." }, { title: "Configure a local origin", detail: "Allow the frontend development origin in FastAPI and verify preflight and actual requests." }] },
        { title: "Authentication and safe data access", focus: "Identity, permissions, and server-side trust", concepts: ["Authentication", "Authorization", "Least privilege"], notes: "Authentication establishes who a requester is; authorization decides what that identity may do. A user interface can hide controls for convenience, but only server-side checks enforce access.\n\nUse the principle of least privilege: grant the minimum access needed, validate ownership on every protected operation, and avoid returning secrets or sensitive records in responses and logs.", questions: [{ question: "What is the difference between authentication and authorization?", answer: "Authentication verifies identity. Authorization determines what that verified identity is permitted to access or change." }, { question: "Why is hiding an admin button not security?", answer: "A requester can call the endpoint directly. The server must check identity and permissions for every protected operation." }], tasks: [{ title: "Protect an update route", detail: "Require an authenticated user and verify that the requested record belongs to them before updating it." }, { title: "Review exposed data", detail: "Inspect your response models and logs for fields that should not be returned or recorded." }] },
        { title: "Build and explain a small feature", focus: "Connect the layers with clear trade-offs", concepts: ["Data flow", "Validation", "Separation of concerns"], notes: "A full-stack feature connects user intent to persistent data: the browser gathers input, the API validates and authorizes it, and the database enforces durable constraints. Trace one request end to end to understand where each responsibility belongs.\n\nIn an interview, describe the simplest working solution first. Then explain trade-offs such as validation duplication, error handling, security boundaries, and how you would test the behavior.", questions: [{ question: "Where should business validation live?", answer: "The server is the trusted place for business rules because requests can bypass the browser. The interface may also validate to give users faster feedback." }, { question: "How would you debug a feature that saves nothing?", answer: "Trace the request from browser network tools through the route, validation, database transaction, and response. Check status and logs at each boundary, then reproduce with a minimal payload." }], tasks: [{ title: "Build a mini task manager", detail: "Create, list, and complete tasks through a browser UI and FastAPI endpoint backed by a relational table." }, { title: "Explain the data flow", detail: "Draw or narrate the request path and identify validation, authorization, persistence, and error boundaries." }] },
        { title: "Project review and debugging", focus: "Test the seams and prepare a clear walkthrough", concepts: ["Unit and integration tests", "Debugging", "Project narrative"], notes: "Tests should protect behavior at useful boundaries. Unit tests isolate small logic; integration tests verify collaborating parts such as routes and persistence. A few tests for normal, invalid, and unauthorized cases are usually more valuable than a large number of superficial assertions.\n\nPrepare a concise project walkthrough: the user problem, your design, a difficult decision, how you tested it, and what you would improve next. Be precise about what you personally built.", questions: [{ question: "What is the difference between a unit test and an integration test?", answer: "A unit test checks a small piece of behavior in isolation. An integration test checks that multiple parts work together across a boundary." }, { question: "How do you discuss a project challenge?", answer: "Describe the context, constraints, options considered, decision, and outcome. Explain your contribution clearly and what you learned." }], tasks: [{ title: "Test a complete API flow", detail: "Cover successful creation and listing plus invalid input and a missing resource. Keep tests repeatable." }, { title: "Practice a two-minute walkthrough", detail: "Explain the user problem, architecture, one trade-off, testing approach, and next improvement." }] },
        { title: "Rapid-fire mock and next steps", focus: "Recall the fundamentals and communicate clearly", concepts: ["Technical recall", "Structured answers", "Reflection"], notes: "A strong interview response starts with a direct answer, adds the reasoning, and finishes with a concrete example or trade-off. If a question is ambiguous, ask a clarifying question before committing to an assumption.\n\nYou do not need to know everything. State what you know, explain how you would investigate the unknown, and keep the reasoning visible. After a mock interview, record one strength and one specific improvement for the next round.", questions: [{ question: "How do you answer when you do not know something?", answer: "Be honest about the boundary of your knowledge, connect to what you do understand, and describe a sensible way to verify the answer. Avoid bluffing." }, { question: "How do you structure a technical explanation?", answer: "Give a concise direct answer, explain why it works, then ground it in a real example or trade-off. Check whether the interviewer wants more depth." }], tasks: [{ title: "Run a 30-minute mock", detail: "Spend ten minutes on fundamentals, ten on project discussion, and ten on a practical problem. Record questions to revisit." }, { title: "Write your review plan", detail: "Choose three strengths, three topics to revisit, and one specific action for the next practice session." }] }
      ]
    }
  }
];

const sampleDays = demoRoadmaps[0].content.days;
const formsDay = sampleDays.splice(1, 1)[0];
sampleDays[0] = {
  ...sampleDays[0],
  title: "HTML and accessible forms",
  focus: "Semantic structure, native controls, and accessible markup",
  notes: `${sampleDays[0].notes}\n\n${formsDay.notes}`,
  concepts: [...sampleDays[0].concepts, ...formsDay.concepts],
  questions: [...sampleDays[0].questions, ...formsDay.questions],
  tasks: [...sampleDays[0].tasks, ...formsDay.tasks]
};
const mockDay = sampleDays.pop();
const reviewDay = sampleDays[sampleDays.length - 1];
reviewDay.title = "Project review, mock interview, and next steps";
reviewDay.focus = "Test the seams, communicate clearly, and plan your next practice session";
reviewDay.notes = `${reviewDay.notes}\n\n${mockDay.notes}`;
reviewDay.concepts.push(...mockDay.concepts);
reviewDay.questions.push(...mockDay.questions);
reviewDay.tasks.push(...mockDay.tasks);

demoRoadmaps.push(
  {
    id: "sample-frontend",
    slug: "frontend-engineer-interview-prep",
    title: "Frontend Engineer",
    track: "Frontend",
    level: "Entry to intermediate",
    duration_days: 7,
    summary: "A seven-day path through accessible HTML, responsive CSS, JavaScript, browser APIs, and frontend interview practice.",
    skills: ["HTML", "CSS", "JavaScript", "Accessibility", "Web APIs"],
    published: true,
    content: { days: [
      { title: "Semantic HTML and accessibility", focus: "Make content clear to browsers, people, and assistive technology", concepts: ["Landmarks", "Heading structure", "Accessible forms"], notes: "Semantic HTML gives content meaning. Use landmarks, headings, lists, and labels according to their purpose, and keep interactive controls operable by keyboard. Accessibility is easiest when it is part of the structure rather than a final visual patch.", questions: [{ question: "Why use a button instead of a clickable div?", answer: "A button already supports keyboard activation, focus, and an accessible role. A div would need those behaviors added correctly." }, { question: "How do labels help form users?", answer: "A label gives a control a programmatic name and a larger click target. Associate it with the input using for and id." }], tasks: [{ title: "Audit a signup form", detail: "Add labels, useful input types, required-field feedback, and keyboard-friendly focus order." }] },
      { title: "CSS cascade and layout", focus: "Build predictable components with Flexbox and Grid", concepts: ["Specificity", "Box sizing", "Flexbox and Grid"], notes: "The cascade resolves declarations by priority and specificity before source order. Keep component styles easy to override and use border-box sizing for predictable dimensions. Use Flexbox for a primary axis and Grid when rows and columns need coordinated tracks.", questions: [{ question: "When is Grid a better fit than Flexbox?", answer: "Grid works well when both dimensions matter, such as a card layout with coordinated columns and rows. Flexbox is usually clearer for a one-dimensional arrangement." }, { question: "How do you avoid specificity wars?", answer: "Keep selectors shallow, scope styles to components, and avoid using IDs or repeated overrides as a substitute for clear ownership." }], tasks: [{ title: "Build a responsive card section", detail: "Create a grid that adapts to available space without fixed card widths." }] },
      { title: "Responsive design", focus: "Let content shape breakpoints and mobile behavior", concepts: ["Intrinsic sizing", "Media queries", "Touch targets"], notes: "Responsive layouts adapt to available space and user needs. Prefer flexible tracks and intrinsic sizing, then add breakpoints when the content stops working. Check text wrapping, navigation, tap targets, and focus order on small screens.", questions: [{ question: "How do you choose a breakpoint?", answer: "Choose it where the content or layout needs to change, then verify the transition rather than targeting a device model." }, { question: "What is the difference between responsive and adaptive layout?", answer: "Responsive layouts fluidly adjust to available space; adaptive designs use more discrete layouts for selected ranges. Real interfaces often combine both." }], tasks: [{ title: "Test a narrow viewport", detail: "Check the page at 320px, 390px, and tablet width. Fix overflow and keep actions usable." }] },
      { title: "JavaScript fundamentals", focus: "Use values, functions, scope, and arrays confidently", concepts: ["let and const", "Closures", "Array transforms"], notes: "Use const for bindings that are not reassigned and let when reassignment is needed. Functions should have clear inputs and outputs. Array methods such as map, filter, and find describe common transformations; choose readability over chaining for its own sake.", questions: [{ question: "What does map return?", answer: "A new array containing the result of calling the mapping function for each element. It does not mutate the source array." }, { question: "What is a closure?", answer: "A function retains access to variables from the lexical scope where it was created, even when called later." }], tasks: [{ title: "Transform UI data", detail: "Filter a list of records by status and map the results into display-ready labels." }] },
      { title: "DOM, events, and forms", focus: "Connect user actions to a clear interface state", concepts: ["Event listeners", "Event delegation", "Form state"], notes: "Attach event listeners from JavaScript and keep interface state explicit. Event delegation uses bubbling so a parent can handle actions from current and future child elements. Prevent default form submission only when you replace it with a working interaction.", questions: [{ question: "What is event bubbling?", answer: "An event propagates from its target through ancestor elements, allowing an ancestor listener to handle it." }, { question: "When is event delegation useful?", answer: "It is useful for repeated or dynamically added items because one stable parent listener can handle their events." }], tasks: [{ title: "Build a filter interaction", detail: "Add a search input that filters a list and shows an explicit empty state." }] },
      { title: "Async UI and browser APIs", focus: "Handle loading, success, and failure states", concepts: ["fetch", "Promises", "HTTP errors"], notes: "fetch is promise-based and does not reject just because an HTTP response is 404 or 500. Check response.ok, handle network failures, and keep loading and error states visible. Avoid updating stale UI after a request has been superseded.", questions: [{ question: "Does fetch reject for a 500 status?", answer: "No. It usually resolves with a Response. Check response.ok and handle unsuccessful statuses explicitly." }, { question: "Why show a loading state?", answer: "It communicates that work is in progress, prevents accidental repeated actions, and gives the interface a predictable transition." }], tasks: [{ title: "Render remote data", detail: "Fetch a resource and implement loading, empty, success, and error states." }] },
      { title: "Frontend review and mock interview", focus: "Explain decisions and demonstrate accessible, robust UI", concepts: ["Performance", "Testing", "Trade-offs"], notes: "Explain a frontend feature by starting with the user need, then describe structure, state, API boundaries, accessibility, and testing. Measure before optimizing; identify the user-visible bottleneck and make a targeted improvement. Be ready to discuss trade-offs and what you would change with more time.", questions: [{ question: "How would you investigate a slow page?", answer: "Reproduce it, measure loading and rendering with browser tools, identify the bottleneck, and optimize the specific resource or work causing it." }, { question: "What makes a component reusable?", answer: "It has a clear responsibility and stable interface, supports meaningful variation, and can be used without knowing its internal details." }], tasks: [{ title: "Run a mock frontend interview", detail: "Explain one project, answer a browser or CSS question, and complete a small UI task while narrating decisions." }] }
    ] }
  },
  {
    id: "sample-backend",
    slug: "python-backend-api-interview-prep",
    title: "Python Backend & API Engineer",
    track: "Backend",
    level: "Entry to intermediate",
    duration_days: 7,
    summary: "A seven-day path through Python, relational data, FastAPI, API design, security boundaries, and backend interview practice.",
    skills: ["Python", "FastAPI", "REST", "SQL", "Testing"],
    published: true,
    content: { days: [
      { title: "Python foundations", focus: "Write readable functions and choose the right collections", concepts: ["Functions", "Dictionaries", "Mutability"], notes: "Python's built-in collections have different behavior and performance characteristics. Use dictionaries for keyed lookup, sets for uniqueness, and lists for ordered mutable sequences. Keep functions focused and use type hints to make interfaces easier to understand.", questions: [{ question: "What is the difference between is and ==?", answer: "== compares values. is checks whether two references point to the same object; use it for identity checks such as value is None." }, { question: "What is a mutable default argument pitfall?", answer: "A mutable default is created once when the function is defined and reused across calls. Use None and create a fresh collection inside the function." }], tasks: [{ title: "Summarize API records", detail: "Write a function that groups records by status and handles missing optional values." }] },
      { title: "Errors, modules, and testing", focus: "Organize code and handle failures deliberately", concepts: ["Modules", "Exceptions", "Unit tests"], notes: "Keep modules cohesive and catch specific exceptions where the program can recover or add useful context. Tests should verify behavior through clear inputs and outcomes. Avoid assertions that simply repeat the implementation.", questions: [{ question: "Why avoid catching Exception everywhere?", answer: "It can conceal unexpected defects and make failures look successful. Catch expected exceptions at a boundary that can handle them." }, { question: "What makes a useful unit test?", answer: "It checks one behavior with a clear setup and outcome, including an important edge case, while remaining repeatable." }], tasks: [{ title: "Test a validation function", detail: "Cover valid input, missing required data, and an invalid value with readable assertions." }] },
      { title: "SQL and data modeling", focus: "Represent relationships and retrieve data efficiently", concepts: ["Primary and foreign keys", "JOIN", "Indexes"], notes: "Relational constraints protect data integrity. Use primary keys to identify rows and foreign keys to represent relationships. JOIN combines related data; indexes should support real query patterns and are not free because writes must maintain them.", questions: [{ question: "What does a foreign key enforce?", answer: "It ensures that a referenced value points to an existing row, preserving a relationship between tables." }, { question: "Why not index every column?", answer: "Indexes use storage and add write overhead. They should support queries that matter, based on actual access patterns." }], tasks: [{ title: "Design a task schema", detail: "Model users and tasks with keys, ownership, timestamps, and a query for incomplete tasks." }] },
      { title: "FastAPI routes and models", focus: "Validate requests and define predictable responses", concepts: ["Path operations", "Pydantic", "HTTP status"], notes: "FastAPI uses path-operation functions and type annotations to validate inputs and build OpenAPI documentation. Pydantic models define data contracts. Keep public request and response schemas intentional, and choose status codes that match the operation.", questions: [{ question: "What does a Pydantic model provide?", answer: "It validates and serializes data from declared fields and types. FastAPI also uses it to describe the API schema." }, { question: "When should a create endpoint return 201?", answer: "When it successfully creates a resource. Include the created representation or a location where the client can retrieve it when appropriate." }], tasks: [{ title: "Create a task endpoint", detail: "Implement a validated POST route with a response model and a suitable success status." }] },
      { title: "REST design and errors", focus: "Make the API consistent and useful to clients", concepts: ["Resource URLs", "Pagination", "Error responses"], notes: "Use resource-oriented paths and consistent request and response shapes. Validate query limits, provide stable pagination behavior, and avoid leaking stack traces or implementation details in error responses. Document common failure cases as part of the API contract.", questions: [{ question: "Why paginate list endpoints?", answer: "Pagination bounds response size and work, making latency and resource usage more predictable as data grows." }, { question: "What belongs in an API error response?", answer: "A stable status and machine-readable code plus a safe, actionable message. Do not expose secrets or internal stack details." }], tasks: [{ title: "Add list pagination", detail: "Support bounded limit and offset or cursor parameters and test invalid bounds." }] },
      { title: "Authentication and persistence", focus: "Protect operations and enforce ownership", concepts: ["Authentication", "Authorization", "Transactions"], notes: "Authentication verifies a caller; authorization decides what that caller may do. Enforce permissions on the server for every protected operation. Database transactions help keep related writes consistent, and ownership checks should happen before returning or changing records.", questions: [{ question: "Can CORS protect an API from unauthorized access?", answer: "No. CORS controls which browser origins may read responses. The API still needs authentication and authorization checks." }, { question: "Why use a database transaction?", answer: "A transaction groups related operations so they commit together or roll back, protecting consistency when a multi-step change fails." }], tasks: [{ title: "Protect an update route", detail: "Require an authenticated identity and verify record ownership before applying an update." }] },
      { title: "API testing and interview mock", focus: "Trace requests and explain backend trade-offs", concepts: ["Integration tests", "Debugging", "Reliability"], notes: "Test the API at its important boundaries: valid requests, invalid data, missing resources, and unauthorized access. Trace a failing request through routing, validation, business logic, persistence, and serialization. Explain the simplest correct design first, then discuss scaling and trade-offs.", questions: [{ question: "How do unit and integration tests differ?", answer: "Unit tests isolate a small behavior. Integration tests exercise collaborating components across a boundary, such as an API route and database." }, { question: "How would you debug a slow endpoint?", answer: "Measure the request, inspect logs and database query timing, reproduce with representative input, and optimize the actual bottleneck." }], tasks: [{ title: "Run a backend mock interview", detail: "Explain one API design choice, debug a failing request, and outline how you would test authorization." }] }
    ] }
  }
);

demoRoadmaps.push(
  {
    id: "sample-java-fullstack",
    slug: "java-spring-full-stack-interview-prep",
    title: "Java Full-Stack Developer",
    track: "Java Full-stack",
    level: "Entry to intermediate",
    duration_days: 10,
    summary: "A practical route through Java, Spring Boot REST APIs, persistence, security, and a connected web UI.",
    skills: ["Java", "Spring Boot", "REST APIs", "JPA", "SQL"],
    published: true,
    content: { days: [
      { title: "Java language foundations", focus: "Types, collections, exceptions, and readable methods", concepts: ["Java types", "Collections", "Exceptions"], notes: "Java is statically typed, so declared types and method signatures make contracts explicit. Choose collections by behavior: List preserves order and permits duplicates, Set enforces uniqueness, and Map associates keys with values. Catch specific exceptions and keep methods focused on one clear responsibility.", questions: [{ question: "What is the difference between == and equals() for objects?", answer: "== compares object references, while equals() compares logical equality when a class implements it appropriately." }, { question: "When would you use a Set?", answer: "Use a Set when uniqueness matters or membership checks are frequent. Choose its implementation based on ordering and performance needs." }], tasks: [{ title: "Build a collection summary", detail: "Write a method that groups a list of orders by status and safely handles an empty input." }] },
      { title: "Object-oriented Java", focus: "Design maintainable types and explain trade-offs", concepts: ["Encapsulation", "Interfaces", "Composition"], notes: "Encapsulation keeps an object's state and invariants behind a clear interface. Interfaces define behavior contracts without requiring callers to depend on a specific implementation. Prefer composition when assembling behavior is simpler than building a deep inheritance hierarchy.", questions: [{ question: "Why program to an interface?", answer: "It reduces coupling to a concrete implementation and makes substitution and testing easier when the contract is stable." }, { question: "What is the benefit of immutability?", answer: "Immutable values are easier to reason about across code paths because their state cannot change after construction." }], tasks: [{ title: "Model a course enrollment", detail: "Create types that represent a learner and enrollment while protecting invalid state transitions." }] },
      { title: "Spring Boot and REST", focus: "Create clear controllers, services, and API contracts", concepts: ["Dependency injection", "Controllers", "HTTP status codes"], notes: "Spring Boot configures application infrastructure from dependencies and conventions. Keep controllers focused on HTTP input and output, move business rules into services, and access persistence through a repository boundary. Constructor injection makes required dependencies explicit and testable.", questions: [{ question: "What is dependency injection?", answer: "A component receives its dependencies from an external container rather than constructing them itself, which reduces coupling and supports testing." }, { question: "What status should a successful create endpoint return?", answer: "Usually 201 Created, optionally including the created resource or a Location header." }], tasks: [{ title: "Build a course API", detail: "Create list and create endpoints with request validation, a service layer, and an appropriate response model." }] },
      { title: "Persistence with JPA and SQL", focus: "Map entities, relationships, and transactions", concepts: ["JPA entities", "Repositories", "Transactions"], notes: "JPA maps Java objects to relational data. Model ownership and relationships deliberately; fetch behavior and cascade rules can have performance and deletion consequences. Transactions group database operations into a consistent unit. Use constraints in the database as well as application validation.", questions: [{ question: "What does @Transactional provide?", answer: "It defines a transaction boundary so related database operations can commit together or roll back on failure, subject to the configured transaction manager." }, { question: "Why be careful with eager relationships?", answer: "They can load more data than a request needs and lead to unexpectedly large queries. Choose fetch behavior based on actual access patterns." }], tasks: [{ title: "Persist course enrollments", detail: "Create entity and repository layers with a relationship, unique constraint, and transactional service operation." }] },
      { title: "Validation and error handling", focus: "Return predictable errors without exposing internals", concepts: ["Bean Validation", "Exception handlers", "API contracts"], notes: "Validate request data at the API boundary with constraints and provide consistent error responses. Central exception handling avoids repeated controller code. Messages should help correct user input without leaking stack traces, SQL, or internal implementation details.", questions: [{ question: "Where should request validation happen?", answer: "At the API boundary, before business operations. Domain invariants should also be enforced in the domain or service layer so other callers cannot bypass them." }, { question: "Why centralize exception mapping?", answer: "It creates a consistent HTTP error contract and keeps controllers focused on successful request flow." }], tasks: [{ title: "Add validation and error responses", detail: "Reject invalid enrollment data and map not-found and conflict conditions to stable API errors." }] },
      { title: "Authentication and authorization", focus: "Protect endpoints and scope access to the caller", concepts: ["Identity", "Roles", "Least privilege"], notes: "Authentication verifies a caller; authorization decides what that caller may do. Apply checks at the server boundary, protect sensitive operations, and verify record ownership. Configure CORS for known frontend origins, but do not mistake it for authentication.", questions: [{ question: "What is the difference between authentication and authorization?", answer: "Authentication establishes identity. Authorization determines whether that identity can perform a requested action." }, { question: "Does CORS secure an endpoint?", answer: "No. CORS controls browser cross-origin access. API authentication and authorization must still protect the endpoint." }], tasks: [{ title: "Secure an update operation", detail: "Require an authenticated user and verify permission before changing an enrollment." }] },
      { title: "Frontend integration", focus: "Connect API data to a usable responsive interface", concepts: ["HTTP client", "Loading and error states", "CORS"], notes: "A full-stack feature traces from an interface action through an HTTP request, validation, business logic, persistence, and a response. The UI should represent loading, success, empty, and error states. Keep API concerns in a small client module and configure CORS with explicit allowed origins.", questions: [{ question: "Why separate API calls from view code?", answer: "It centralizes request details and error handling and keeps UI components focused on presentation and user interaction." }, { question: "What UI states should a data screen cover?", answer: "At minimum loading, successful data, empty results, and recoverable errors, with actions available where appropriate." }], tasks: [{ title: "Connect an enrollment screen", detail: "Load and create records from your API and show clear loading, success, empty, and failure feedback." }] },
      { title: "Testing and interview walkthrough", focus: "Verify behavior across layers and communicate decisions", concepts: ["Unit tests", "Integration tests", "Project narrative"], notes: "Unit tests cover focused logic; integration tests verify collaborating components such as a route, service, and repository. Test normal and failure paths. In a project walkthrough, explain the user need, architecture, trade-off, validation and security boundaries, and what you would improve next.", questions: [{ question: "How do unit and integration tests differ?", answer: "Unit tests isolate a small behavior, while integration tests exercise multiple collaborators across a boundary." }, { question: "How do you diagnose a slow database-backed endpoint?", answer: "Measure the request and query timings, inspect the generated SQL and query plan, and optimize the measured bottleneck." }], tasks: [{ title: "Run a full-stack mock interview", detail: "Explain a feature end to end, discuss a Spring design choice, and test one failure scenario." }] }
    ] }
  },
  {
    id: "sample-uiux",
    slug: "ui-ux-design-interview-prep",
    title: "UI/UX Design",
    track: "UI/UX",
    level: "Beginner to intermediate",
    duration_days: 7,
    summary: "A seven-day design preparation path through research, flows, wireframes, visual systems, prototyping, accessibility, and portfolio storytelling.",
    skills: ["User research", "Wireframing", "Figma", "Prototyping", "Accessibility"],
    published: true,
    content: { days: [
      { title: "Understand the problem", focus: "Start from user needs and evidence", concepts: ["Problem framing", "User interviews", "Assumptions"], notes: "Design begins with understanding the people and context behind a problem. Separate observed evidence from assumptions, ask open questions, and avoid treating the first requested feature as the real user need. Frame a problem statement that can guide exploration without prematurely choosing a solution.", questions: [{ question: "How do you avoid leading a user interview?", answer: "Ask open, neutral questions about past behavior and real examples rather than suggesting a desired answer or asking users to approve a concept." }, { question: "What is a useful problem statement?", answer: "It names the audience, unmet need, and context while leaving room for multiple solution directions." }], tasks: [{ title: "Write a problem brief", detail: "Choose a familiar workflow, list assumptions, and write three neutral questions to learn about current behavior." }] },
      { title: "Map the user journey", focus: "Make steps, decisions, and friction visible", concepts: ["User flows", "Journey maps", "Edge cases"], notes: "A user flow shows the steps and decisions needed to complete a task. Include entry points, alternate paths, and recovery from errors. A journey map adds the user's context, expectations, and friction over time. Keep the map grounded in evidence and focused on one scenario.", questions: [{ question: "What is the difference between a user flow and a journey map?", answer: "A flow focuses on steps and decisions in an interaction. A journey map describes the broader experience, context, and emotions across stages." }, { question: "Why include error states in a flow?", answer: "They reveal how users recover when information is missing, a service fails, or an assumption is wrong." }], tasks: [{ title: "Map a booking flow", detail: "Diagram the happy path plus one cancellation, validation, and service-error path." }] },
      { title: "Wireframes and information hierarchy", focus: "Test structure before visual polish", concepts: ["Hierarchy", "Low fidelity", "Content priority"], notes: "Wireframes help teams reason about structure and content before committing to visual detail. Give the primary action clear emphasis, group related information, and use realistic labels instead of decorative placeholder copy. Low fidelity is a tool for fast learning, not an excuse to ignore layout constraints.", questions: [{ question: "Why start with low-fidelity wireframes?", answer: "They make structure and task flow easier to discuss and revise before visual polish creates attachment to a direction." }, { question: "How do you decide visual hierarchy?", answer: "Prioritize information by user goal and context, then use placement, size, contrast, and grouping consistently." }], tasks: [{ title: "Wireframe a dashboard", detail: "Sketch the key task, data hierarchy, empty state, and one narrow-screen adaptation." }] },
      { title: "Visual design and design systems", focus: "Create consistent, purposeful interface patterns", concepts: ["Typography", "Color contrast", "Reusable components"], notes: "A design system connects design tokens, reusable components, and usage guidance. Consistency helps users predict behavior, while hierarchy directs attention. Choose type and color for readability and meaning, verify contrast, and design components with realistic content and states.", questions: [{ question: "What belongs in a design system?", answer: "Shared foundations such as tokens, components, patterns, and guidance for their use and accessibility." }, { question: "How do you select a color palette?", answer: "Start from brand and semantic needs, then check contrast and meaning across states rather than choosing colors only by appearance." }], tasks: [{ title: "Create a small component set", detail: "Define button, input, and card variants with default, hover, focus, disabled, and error states." }] },
      { title: "Prototype and test", focus: "Use prototypes to answer focused questions", concepts: ["Prototype fidelity", "Usability testing", "Iteration"], notes: "A prototype should have only enough fidelity to test the question at hand. Give participants a realistic task, observe what they do, and avoid coaching them toward the intended path. Record behavior and confusion, then prioritize improvements by impact and evidence.", questions: [{ question: "What makes a usability test useful?", answer: "A realistic task, a neutral moderator, representative participants, and observation of behavior rather than leading opinions." }, { question: "How do you choose prototype fidelity?", answer: "Choose the lowest fidelity that can answer the current design question reliably." }], tasks: [{ title: "Test a checkout prototype", detail: "Ask someone to complete a purchase scenario, observe without helping, and note one high-impact friction point." }] },
      { title: "Accessibility and responsive behavior", focus: "Design for different abilities, devices, and situations", concepts: ["Keyboard access", "Contrast", "Responsive patterns"], notes: "Accessibility includes readable contrast, clear labels, keyboard access, visible focus, understandable errors, and layouts that work with zoom and smaller viewports. Do not rely on color alone to communicate status. Consider how content reflows and how touch targets behave on mobile.", questions: [{ question: "Why is color alone insufficient for status?", answer: "People with color-vision differences or limited display conditions may not distinguish it. Pair color with text, icons, or other cues." }, { question: "What should a keyboard accessibility review include?", answer: "Logical focus order, visible focus, operable controls, no keyboard traps, and access to all essential actions." }], tasks: [{ title: "Audit a mobile flow", detail: "Check contrast, focus indicators, control labels, text zoom, and status cues without color." }] },
      { title: "Portfolio and design interview", focus: "Tell a clear story about decisions and outcomes", concepts: ["Case studies", "Trade-offs", "Reflection"], notes: "A strong case study explains the problem, constraints, your role, evidence, iterations, and outcomes. Show decisions and what changed, not only polished screens. Be candid about limitations and explain what you would learn or measure next. In an interview, make your contribution and collaboration clear.", questions: [{ question: "How do you present a design that did not ship?", answer: "Explain the goal, constraints, work completed, what you learned, and how the work informed the next decision without overstating impact." }, { question: "How do you measure design success?", answer: "Choose measures linked to the user and business goal, combine behavioral signals with qualitative feedback, and interpret results in context." }], tasks: [{ title: "Prepare a five-minute case study", detail: "Present the problem, evidence, key iteration, trade-off, outcome, and one next experiment." }] }
    ] }
  }
);

const state = { client: null, user: null, admin: false, roadmaps: [], activeRoadmap: null, activeDay: 0, activeTab: "notes", selectedTrack: "All", adminRoadmaps: [], roomRoadmapId: null, roomTopicIndex: 0, generatedTest: null };
const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);
const lineBreaks = value => escapeHtml(value).replace(/\n/g, "<br>");
const roadmapDays = roadmap => roadmap?.content?.days || [];
const taskStorageKey = roadmap => `prep-complete-${roadmap?.slug || roadmap?.id}`;

function normalizedRoadmap(row) {
  return { ...row, skills: Array.isArray(row.skills) ? row.skills : (row.content?.skills || []) };
}

async function loadRoadmaps() {
  if (hasBackendConfig && window.location.protocol !== "file:") {
    try {
      const response = await fetch("/api/roadmaps");
      if (response.ok) {
        const data = await response.json();
        state.roadmaps = (data || []).map(normalizedRoadmap);
        if (state.roadmaps.length) return;
      } else {
        console.warn("The cached roadmap endpoint returned", response.status);
      }
    } catch (error) {
      console.warn("The cached roadmap endpoint is unavailable; trying the database client.", error);
    }
  }

  if (state.client) {
    const { data, error } = await state.client.from("prep_roadmaps").select("*").eq("published", true).order("updated_at", { ascending: false });
    if (!error && data?.length) {
      state.roadmaps = data.map(normalizedRoadmap);
      return;
    }
    if (error) console.error("Could not load published roadmaps:", error.message);
  }

  state.roadmaps = demoRoadmaps.map(normalizedRoadmap);
}

function renderRoadmaps() {
  const query = $("#roadmap-search").value.trim().toLowerCase();
  const visible = state.roadmaps.filter(roadmap => {
    const matchesTrack = state.selectedTrack === "All" || roadmap.track === state.selectedTrack;
    const searchable = [roadmap.title, roadmap.track, roadmap.level, roadmap.summary, ...(roadmap.skills || [])].join(" ").toLowerCase();
    return matchesTrack && (!query || searchable.includes(query));
  });
  $("#roadmap-grid").innerHTML = visible.map((roadmap, index) => `
    <article class="roadmap-card">
      <div class="card-topline"><span class="track-label">${escapeHtml(roadmap.track || "Career path")}</span><span class="card-index">0${index + 1}</span></div>
      <h3>${escapeHtml(roadmap.title)}</h3><p>${escapeHtml(roadmap.summary || "A practical roadmap with notes, interview questions, and hands-on work.")}</p>
      <div class="tag-row">${(roadmap.skills || []).slice(0, 4).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("")}</div>
      <div class="card-bottom"><div class="card-meta"><span>${Number(roadmap.duration_days) || roadmapDays(roadmap).length} days</span><span>${escapeHtml(roadmap.level || "All levels")}</span></div><button class="card-open" type="button" data-open-roadmap="${escapeHtml(roadmap.id)}">Start roadmap <span aria-hidden="true">&#8594;</span></button></div>
    </article>`).join("");
  $("#empty-state").hidden = visible.length > 0;
  $("#roadmap-grid").hidden = visible.length === 0;
}

function renderDayList() {
  const days = roadmapDays(state.activeRoadmap);
  const completed = JSON.parse(localStorage.getItem(taskStorageKey(state.activeRoadmap)) || "[]");
  $("#day-total").textContent = `${days.length} DAYS`;
  $("#day-list").innerHTML = days.map((day, index) => `<button class="day-button ${index === state.activeDay ? "active" : ""}" type="button" data-day-index="${index}"><span class="day-number">${String(index + 1).padStart(2, "0")}</span><span class="day-button-title">${escapeHtml(day.title || `Day ${index + 1}`)}</span><small>${(day.tasks || []).filter((_, taskIndex) => completed.includes(`${index}-${taskIndex}`)).length}/${(day.tasks || []).length} tasks done</small></button>`).join("");
  const taskTotal = days.reduce((sum, day) => sum + (day.tasks || []).length, 0);
  const completedTotal = completed.length;
  const percentage = taskTotal ? Math.round((completedTotal / taskTotal) * 100) : 0;
  $("#progress-count").textContent = `${percentage}%`;
}

function renderLesson() {
  const roadmap = state.activeRoadmap;
  const days = roadmapDays(roadmap);
  const day = days[state.activeDay];
  if (!day) {
    $("#lesson-area").innerHTML = `<p class="lesson-empty">This roadmap does not have any days yet. The admin can add day-by-day notes from the content desk.</p>`;
    return;
  }
  const completed = JSON.parse(localStorage.getItem(taskStorageKey(roadmap)) || "[]");
  let pane = "";
  if (state.activeTab === "notes") {
    pane = `<h4>Today's notes</h4><div class="lesson-notes">${lineBreaks(day.notes || "Notes for this day are coming soon.")}</div><div class="concept-list">${(day.concepts || []).map(item => `<span class="concept-pill">${escapeHtml(item)}</span>`).join("")}</div>`;
  } else if (state.activeTab === "questions") {
    pane = (day.questions || []).length ? `<div class="question-list">${day.questions.map((item, index) => `<details class="question-item"><summary><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item.question)}<span>Reveal answer</span></summary><p class="question-answer">${lineBreaks(item.answer)}</p></details>`).join("")}</div>` : `<p class="lesson-empty">No rapid-fire questions have been added for this day yet.</p>`;
  } else {
    pane = (day.tasks || []).length ? `<div class="task-list">${day.tasks.map((item, index) => `<label class="task-item"><input type="checkbox" data-task-index="${index}" ${completed.includes(`${state.activeDay}-${index}`) ? "checked" : ""}><span><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.detail)}</p></span></label>`).join("")}</div>` : `<p class="lesson-empty">No practice tasks have been added for this day yet.</p>`;
  }
  $("#lesson-area").innerHTML = `<div class="lesson-top"><div><p class="eyebrow eyebrow-dark">DAY ${String(state.activeDay + 1).padStart(2, "0")} / ${String(days.length).padStart(2, "0")}</p><h3>${escapeHtml(day.title || `Day ${state.activeDay + 1}`)}</h3><p class="lesson-focus">${escapeHtml(day.focus || "Build confidence through focused practice.")}</p></div><button class="print-button" type="button" id="print-lesson">Print day</button></div>
    <div class="lesson-tabs" role="tablist" aria-label="Daily preparation material">
      <button class="lesson-tab ${state.activeTab === "notes" ? "active" : ""}" role="tab" aria-selected="${state.activeTab === "notes"}" data-tab="notes" type="button">Prep notes</button>
      <button class="lesson-tab ${state.activeTab === "questions" ? "active" : ""}" role="tab" aria-selected="${state.activeTab === "questions"}" data-tab="questions" type="button">Rapid fire <span>(${(day.questions || []).length})</span></button>
      <button class="lesson-tab ${state.activeTab === "tasks" ? "active" : ""}" role="tab" aria-selected="${state.activeTab === "tasks"}" data-tab="tasks" type="button">Interview tasks <span>(${(day.tasks || []).length})</span></button>
    </div><div class="lesson-content">${pane}</div>
    <div class="next-day"><button type="button" id="next-day" ${state.activeDay >= days.length - 1 ? "disabled" : ""}>${state.activeDay >= days.length - 1 ? "End of roadmap" : "Next day &#8594;"}</button></div>`;
}

function selectRoadmap(id) {
  const roadmap = state.roadmaps.find(item => String(item.id) === String(id));
  if (!roadmap) return;
  state.activeRoadmap = roadmap;
  state.activeDay = 0;
  state.activeTab = "notes";
  $("#detail-kicker").innerHTML = `<span class="eyebrow-line"></span> ${escapeHtml(roadmap.track || "CAREER PATH")}`;
  $("#detail-title").textContent = roadmap.title;
  $("#detail-description").textContent = roadmap.summary || "Follow the daily prep notes, rapid-fire interview questions, and hands-on tasks.";
  $("#detail-meta").innerHTML = `<span>${Number(roadmap.duration_days) || roadmapDays(roadmap).length} focused days</span><span>${escapeHtml(roadmap.level || "All levels")}</span><span>${roadmapDays(roadmap).length} daily lessons</span>`;
  $("#roadmap-detail").hidden = false;
  renderDayList();
  renderLesson();
  $("#roadmap-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderInterviewTopics() {
  const roadmapSelect = $("#room-roadmap-select");
  const topicSelect = $("#room-topic-select");
  if (!roadmapSelect || !topicSelect) return;
  const selectedRoadmap = state.roadmaps.find(item => String(item.id) === roadmapSelect.value) || state.roadmaps[0];
  if (!selectedRoadmap) {
    $("#room-content").innerHTML = `<p class="lesson-empty">No learning material is available yet.</p>`;
    return;
  }
  state.roomRoadmapId = String(selectedRoadmap.id);
  const days = roadmapDays(selectedRoadmap);
  topicSelect.innerHTML = days.map((day, index) => `<option value="${index}">${String(index + 1).padStart(2, "0")} / ${escapeHtml(day.title || `Topic ${index + 1}`)}</option>`).join("");
  state.roomTopicIndex = Math.min(state.roomTopicIndex, Math.max(days.length - 1, 0));
  topicSelect.value = String(state.roomTopicIndex);
  const day = days[state.roomTopicIndex];
  if (!day) {
    $("#room-subject-label").textContent = selectedRoadmap.title;
    $("#room-content").innerHTML = `<p class="lesson-empty">This roadmap has no topics yet. Check back after an admin adds its daily curriculum.</p>`;
    return;
  }
  $("#room-subject-label").textContent = `${selectedRoadmap.title} / ${day.title}`;
  const questions = day.questions || [];
  const tasks = day.tasks || [];
  $("#room-content").innerHTML = `
    <article class="room-material">
      <div class="room-material-heading"><span class="material-index">${String(state.roomTopicIndex + 1).padStart(2, "0")}</span><div><p class="eyebrow eyebrow-dark">${escapeHtml(selectedRoadmap.track || "CAREER PATH")} / TOPIC ${state.roomTopicIndex + 1}</p><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.focus || "Review the material and practice explaining it.")}</p></div></div>
      <section class="room-notes"><h4>Learning material</h4><div class="lesson-notes">${lineBreaks(day.notes || "Notes for this topic are coming soon.")}</div>${(day.concepts || []).length ? `<div class="concept-list">${day.concepts.map(concept => `<span class="concept-pill">${escapeHtml(concept)}</span>`).join("")}</div>` : ""}</section>
      <section class="room-questions"><div class="room-section-title"><h4>Interview questions</h4><span>${questions.length} QUESTIONS</span></div>${questions.length ? `<div class="question-list">${questions.map((item, index) => `<details class="question-item"><summary><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item.question)}<span>Reveal answer</span></summary><p class="question-answer">${lineBreaks(item.answer)}</p></details>`).join("")}</div>` : `<p class="lesson-empty">No interview questions are available for this topic yet.</p>`}</section>
      ${tasks.length ? `<section class="room-tasks"><div class="room-section-title"><h4>Practice tasks</h4><span>${tasks.length} TASKS</span></div><div class="room-task-list">${tasks.map(task => `<div class="room-task"><b>${escapeHtml(task.title)}</b><p>${escapeHtml(task.detail)}</p></div>`).join("")}</div></section>` : ""}
    </article>`;
  state.generatedTest = null;
  $("#test-area").hidden = true;
  $("#test-status").textContent = "";
}

function renderInterviewRoom() {
  const roadmapSelect = $("#room-roadmap-select");
  if (!roadmapSelect) return;
  const previousId = state.roomRoadmapId;
  roadmapSelect.innerHTML = state.roadmaps.map(roadmap => `<option value="${escapeHtml(roadmap.id)}">${escapeHtml(roadmap.title)}</option>`).join("");
  state.roomRoadmapId = state.roadmaps.some(roadmap => String(roadmap.id) === previousId) ? previousId : String(state.roadmaps[0]?.id || "");
  roadmapSelect.value = state.roomRoadmapId;
  state.roomTopicIndex = 0;
  renderInterviewTopics();
}

async function generateRoomTest() {
  const roadmapSelect = $("#room-roadmap-select");
  const topicSelect = $("#room-topic-select");
  const roadmap = state.roadmaps.find(item => String(item.id) === roadmapSelect.value);
  const day = roadmapDays(roadmap)[Number(topicSelect.value) || 0];
  if (!roadmap || !day?.notes) {
    $("#test-status").textContent = "Choose a topic that has learning notes before generating a test.";
    return;
  }

  const button = $("#generate-test");
  const requestedRoadmapId = String(roadmap.id);
  const requestedTopicIndex = Number(topicSelect.value) || 0;
  button.disabled = true;
  button.textContent = "Generating...";
  $("#test-status").textContent = "Ollama is building a test from this topic. This can take a little while.";
  $("#test-area").hidden = true;

  try {
    const response = await fetch("/api/generate-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roadmap: roadmap.title,
        topic: day.title,
        notes: `${day.notes}\n\nKey concepts: ${(day.concepts || []).join(", ")}`,
        questions: day.questions || [],
        questionCount: Number($("#test-question-count").value),
        difficulty: $("#test-difficulty").value
      })
    });
    const result = await response.json().catch(() => ({ error: "The test API is not running. Use Vercel deployment or `vercel dev` to generate AI tests." }));
    if (!response.ok) throw new Error(result.error || "Test generation failed. Please try again.");
    if (String($("#room-roadmap-select").value) !== requestedRoadmapId || Number($("#room-topic-select").value) !== requestedTopicIndex) {
      $("#test-status").textContent = "Topic changed while the test was generating. Choose Generate test again for the selected topic.";
      return;
    }
    state.generatedTest = { ...result, submitted: false };
    $("#test-status").textContent = "";
    renderGeneratedTest();
  } catch (error) {
    $("#test-status").textContent = error.message;
  } finally {
    button.disabled = false;
    button.innerHTML = `Generate test <span aria-hidden="true">&#8594;</span>`;
  }
}

function renderGeneratedTest() {
  const test = state.generatedTest;
  const area = $("#test-area");
  if (!test) { area.hidden = true; return; }
  const score = test.submitted ? test.questions.reduce((total, question, index) => {
    const selected = test.answers[index];
    return total + (selected === question.answerIndex ? 1 : 0);
  }, 0) : 0;

  area.hidden = false;
  area.innerHTML = `<form class="generated-test" id="generated-test-form">
    <div class="generated-test-heading"><div><h3>${escapeHtml(test.title)}</h3><p>${escapeHtml(test.instructions)}</p></div><span class="test-kicker">${test.questions.length} QUESTIONS</span></div>
    ${test.submitted ? `<div class="test-result"><strong>${score} / ${test.questions.length} correct</strong><p>${score === test.questions.length ? "Excellent work. You have this topic down." : "Review the explanations below and revisit any concepts that felt uncertain."}</p></div>` : ""}
    ${test.questions.map((question, questionIndex) => `<fieldset class="test-question ${test.submitted ? (test.answers[questionIndex] === question.answerIndex ? "correct" : "incorrect") : ""}"><legend>${String(questionIndex + 1).padStart(2, "0")} / ${escapeHtml(question.question)}</legend><div class="test-options-list">${question.options.map((option, optionIndex) => `<label class="test-choice"><input type="radio" name="answer-${questionIndex}" value="${optionIndex}" ${test.submitted ? "disabled" : "required"} ${test.submitted && test.answers[questionIndex] === optionIndex ? "checked" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</div>${test.submitted ? `<p class="test-explanation"><b>${test.answers[questionIndex] === question.answerIndex ? "Correct." : `Answer: ${escapeHtml(question.options[question.answerIndex])}.`}</b> ${escapeHtml(question.explanation)}</p>` : ""}</fieldset>`).join("")}
    ${test.submitted ? `<button class="button button-outline" id="retake-test" type="button">Generate another test</button>` : `<button class="button button-dark test-submit" type="submit">Submit answers</button>`}
  </form>`;
}

function submitGeneratedTest(event) {
  event.preventDefault();
  if (!state.generatedTest) return;
  state.generatedTest.answers = state.generatedTest.questions.map((_, index) => {
    const selected = event.currentTarget.querySelector(`input[name="answer-${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });
  state.generatedTest.submitted = true;
  renderGeneratedTest();
}

function setActiveDay(index) {
  state.activeDay = index;
  renderDayList();
  renderLesson();
}

function openAdminDialog() {
  $("#admin-dialog").showModal();
  renderAdmin();
}

function renderAdmin(message = "") {
  if (!hasBackendConfig || !state.client) {
    $("#admin-body").innerHTML = `<p class="admin-note">Shared publishing is not configured yet. Add the Supabase project URL and public anon key to <b>config.js</b>, run <b>supabase/schema.sql</b>, then create an admin account and allowlist it. The public sample roadmap remains available without setup.</p><p class="admin-status">No private credentials belong in this static app. The anon key is public; database row-level security protects admin writes.</p>`;
    return;
  }
  if (!state.user || !state.admin) {
    $("#admin-body").innerHTML = `<p class="admin-note">Sign in with an admin account to create career paths, edit day-by-day material, and publish it for every visitor.</p><form class="admin-form" id="login-form"><div class="field"><label for="admin-email">Admin email</label><input id="admin-email" name="email" type="email" autocomplete="username" required></div><div class="field"><label for="admin-password">Password</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required></div><button class="button button-dark" type="submit">Sign in</button><p class="admin-status" id="admin-status" role="status">${escapeHtml(message)}</p></form>`;
    return;
  }
  renderAdminDashboard(message);
}

async function verifyAdmin(user) {
  if (!user) { state.user = null; state.admin = false; return false; }
  const { data, error } = await state.client.from("prep_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  state.user = user;
  state.admin = !error && Boolean(data);
  return state.admin;
}

function renderAdminDashboard(message = "") {
  const rows = state.adminRoadmaps;
  $("#admin-body").innerHTML = `<div class="admin-toolbar"><span>Signed in as ${escapeHtml(state.user.email || "admin")}</span><button type="button" id="admin-signout">Sign out</button></div>
    <div class="admin-list">${rows.length ? rows.map(row => `<div class="admin-list-item"><span><b>${escapeHtml(row.title)}</b><small>${escapeHtml(row.track || "Career path")} &middot; ${roadmapDays(row).length} days &middot; ${row.published ? "Published" : "Draft"}</small></span><button type="button" data-edit-roadmap="${escapeHtml(row.id)}">Edit roadmap</button></div>`).join("") : `<p class="lesson-empty">No roadmaps yet. Create one below or publish the sample pathway to make it editable.</p>`}</div>
    ${rows.length ? "" : `<button class="button button-outline" id="publish-sample" type="button">Publish sample pathways</button>`}
    <form class="admin-form" id="roadmap-form"><div class="admin-subheading"><span id="roadmap-form-heading">Create a career roadmap</span><button id="new-roadmap" type="button">Clear form</button></div>
      <input type="hidden" name="id">
      <div class="form-grid"><div class="field"><label for="roadmap-title">Role / roadmap title</label><input id="roadmap-title" name="title" required placeholder="Python Full-Stack Developer"></div><div class="field"><label for="roadmap-track">Career branch</label><select id="roadmap-track" name="track"><option>Full-stack</option><option>Frontend</option><option>Backend</option><option>Java Full-stack</option><option>UI/UX</option></select></div></div>
      <div class="form-grid"><div class="field"><label for="roadmap-level">Experience level</label><input id="roadmap-level" name="level" placeholder="Entry to intermediate"></div><div class="field"><label for="roadmap-duration">Roadmap length in days</label><input id="roadmap-duration" name="duration_days" type="number" min="1" max="365" value="15"></div></div>
      <div class="field"><label for="roadmap-summary">Roadmap description</label><textarea id="roadmap-summary" name="summary" required placeholder="What will the learner be ready to do?"></textarea></div>
      <div class="field"><label for="roadmap-skills">Skill tags</label><input id="roadmap-skills" name="skills" placeholder="HTML, CSS, JavaScript, Python, FastAPI"></div>
      <label class="check-row"><input name="published" type="checkbox" checked> Publish for all visitors</label>
      <div class="admin-subheading"><span>Daily curriculum</span><button id="add-day" type="button">+ Add day</button></div>
      <p class="editor-instructions">Enter one topic per line. Rapid-fire questions use <b>question | answer</b> per line. Practice tasks use <b>task title | task details</b> per line.</p>
      <div id="day-editors"></div>
      <div class="form-actions"><button class="button button-dark" type="submit">Save roadmap</button><button class="button button-outline" id="delete-roadmap" type="button" hidden>Delete roadmap</button></div>
      <p class="admin-status" id="admin-status" role="status">${escapeHtml(message)}</p>
    </form>`;
}

function fillRoadmapForm(roadmap) {
  const form = $("#roadmap-form");
  if (!form) return;
  form.elements.id.value = roadmap?.id || "";
  form.elements.title.value = roadmap?.title || "";
  form.elements.track.value = roadmap?.track || "Full-stack";
  form.elements.level.value = roadmap?.level || "Entry to intermediate";
  form.elements.duration_days.value = roadmap?.duration_days || 15;
  form.elements.summary.value = roadmap?.summary || "";
  form.elements.skills.value = (roadmap?.skills || roadmap?.content?.skills || []).join(", ");
  form.elements.published.checked = roadmap?.published !== false;
  $("#roadmap-form-heading").textContent = roadmap ? `Edit: ${roadmap.title}` : "Create a career roadmap";
  $("#delete-roadmap").hidden = !roadmap?.id;
  $("#day-editors").innerHTML = "";
  (roadmapDays(roadmap)).forEach((day, index) => addDayEditor(day, index + 1));
}

function addDayEditor(day = {}, number = $("#day-editors").children.length + 1) {
  const container = $("#day-editors");
  if (!container) return;
  const editor = document.createElement("div");
  editor.className = "day-editor";
  editor.innerHTML = `<div class="day-editor-top"><b>Day ${number}</b><button type="button" data-remove-day>Remove day</button></div>
    <div class="form-grid"><div class="field"><label>Lesson title</label><input data-day-title required value="${escapeHtml(day.title || "")}" placeholder="Semantic HTML"></div><div class="field"><label>Focus</label><input data-day-focus value="${escapeHtml(day.focus || "")}" placeholder="Accessible page structure"></div></div>
    <div class="field"><label>Prep notes</label><textarea data-day-notes placeholder="Explain the core concepts and practical context.">${escapeHtml(day.notes || "")}</textarea></div>
    <div class="form-grid"><div class="field"><label>Key concepts</label><textarea data-day-concepts placeholder="One topic per line">${escapeHtml((day.concepts || []).join("\n"))}</textarea></div><div class="field"><label>Rapid-fire Q&A</label><textarea data-day-questions placeholder="Question | Answer">${escapeHtml((day.questions || []).map(item => `${item.question} | ${item.answer}`).join("\n"))}</textarea></div></div>
    <div class="field"><label>Interview / practice tasks</label><textarea data-day-tasks placeholder="Task title | Task details">${escapeHtml((day.tasks || []).map(item => `${item.title} | ${item.detail}`).join("\n"))}</textarea></div>`;
  container.append(editor);
}

function readDayEditors() {
  return [...$("#day-editors").querySelectorAll(".day-editor")].map(editor => {
    const parsePairs = (text, firstKey, secondKey) => text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
      const separator = line.indexOf("|");
      if (separator < 0) return { [firstKey]: line, [secondKey]: "" };
      return { [firstKey]: line.slice(0, separator).trim(), [secondKey]: line.slice(separator + 1).trim() };
    });
    return {
      title: $("[data-day-title]", editor).value.trim(),
      focus: $("[data-day-focus]", editor).value.trim(),
      notes: $("[data-day-notes]", editor).value.trim(),
      concepts: $("[data-day-concepts]", editor).value.split("\n").map(item => item.trim()).filter(Boolean),
      questions: parsePairs($("[data-day-questions]", editor).value, "question", "answer").filter(item => item.question),
      tasks: parsePairs($("[data-day-tasks]", editor).value, "title", "detail").filter(item => item.title)
    };
  }).filter(day => day.title);
}

async function loadAdminRoadmaps() {
  const { data, error } = await state.client.from("prep_roadmaps").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  state.adminRoadmaps = data || [];
}

async function openAdminDashboard(message = "") {
  try {
    await loadAdminRoadmaps();
    renderAdminDashboard(message);
    if (state.adminRoadmaps.length) fillRoadmapForm(null);
  } catch (error) {
    renderAdmin(`Could not load roadmaps: ${error.message}`);
  }
}

function newSlug(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function saveRoadmap(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $("#admin-status");
  const existingId = form.elements.id.value;
  const title = form.elements.title.value.trim();
  const content = { days: readDayEditors(), skills: form.elements.skills.value.split(",").map(item => item.trim()).filter(Boolean) };
  const payload = { title, slug: newSlug(title), track: form.elements.track.value, level: form.elements.level.value.trim() || "All levels", duration_days: Number(form.elements.duration_days.value) || content.days.length, summary: form.elements.summary.value.trim(), content, published: form.elements.published.checked, updated_at: new Date().toISOString() };
  status.textContent = "Saving roadmap...";
  const request = existingId
    ? state.client.from("prep_roadmaps").update(payload).eq("id", existingId).select().single()
    : state.client.from("prep_roadmaps").insert(payload).select().single();
  const { data, error } = await request;
  if (error) { status.textContent = error.message; return; }
  await loadAdminRoadmaps();
  await loadRoadmaps();
  renderRoadmaps();
  renderAdminDashboard("Roadmap saved.");
  fillRoadmapForm(data);
}

async function publishSampleRoadmap() {
  for (const sample of demoRoadmaps) {
    const { data: existing, error: lookupError } = await state.client.from("prep_roadmaps").select("id").eq("slug", sample.slug).maybeSingle();
    if (lookupError) { renderAdminDashboard(lookupError.message); return; }
    if (existing) continue;
    const { error } = await state.client.from("prep_roadmaps").insert({ slug: sample.slug, title: sample.title, track: sample.track, level: sample.level, duration_days: sample.duration_days, summary: sample.summary, content: { ...sample.content, skills: sample.skills }, published: true });
    if (error) { renderAdminDashboard(error.message); return; }
  }
  await openAdminDashboard("Sample pathways published. You can now edit them below.");
  await loadRoadmaps();
  renderRoadmaps();
}

async function deleteRoadmap() {
  const id = $("#roadmap-form").elements.id.value;
  if (!id || !window.confirm("Delete this roadmap and its day-by-day content?")) return;
  const { error } = await state.client.from("prep_roadmaps").delete().eq("id", id);
  if (error) { $("#admin-status").textContent = error.message; return; }
  await loadAdminRoadmaps();
  await loadRoadmaps();
  renderRoadmaps();
  await openAdminDashboard("Roadmap deleted.");
}

document.addEventListener("click", async event => {
  const roadmapButton = event.target.closest("[data-open-roadmap]");
  if (roadmapButton) selectRoadmap(roadmapButton.dataset.openRoadmap);
  const dayButton = event.target.closest("[data-day-index]");
  if (dayButton && state.activeRoadmap) setActiveDay(Number(dayButton.dataset.dayIndex));
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) { state.activeTab = tabButton.dataset.tab; renderLesson(); }
  if (event.target.closest("#back-to-paths")) $("#pathways").scrollIntoView({ behavior: "smooth" });
  if (event.target.closest("#next-day") && state.activeDay < roadmapDays(state.activeRoadmap).length - 1) setActiveDay(state.activeDay + 1);
  if (event.target.closest("#print-lesson")) window.print();
  const removeDay = event.target.closest("[data-remove-day]");
  if (removeDay) removeDay.closest(".day-editor").remove();
  const editButton = event.target.closest("[data-edit-roadmap]");
  if (editButton) fillRoadmapForm(state.adminRoadmaps.find(item => String(item.id) === editButton.dataset.editRoadmap));
  if (event.target.closest("#new-roadmap")) fillRoadmapForm(null);
  if (event.target.closest("#add-day")) addDayEditor();
  if (event.target.closest("#publish-sample")) await publishSampleRoadmap();
  if (event.target.closest("#delete-roadmap")) await deleteRoadmap();
  if (event.target.closest("#admin-signout")) {
    await state.client.auth.signOut();
    state.user = null;
    state.admin = false;
    renderAdmin();
  }
});

document.addEventListener("change", event => {
  if (!event.target.matches("[data-task-index]") || !state.activeRoadmap) return;
  const completed = JSON.parse(localStorage.getItem(taskStorageKey(state.activeRoadmap)) || "[]");
  const key = `${state.activeDay}-${event.target.dataset.taskIndex}`;
  const next = event.target.checked ? [...new Set([...completed, key])] : completed.filter(item => item !== key);
  localStorage.setItem(taskStorageKey(state.activeRoadmap), JSON.stringify(next));
  renderDayList();
  renderLesson();
});

document.addEventListener("submit", async event => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { data, error } = await state.client.auth.signInWithPassword({ email: formData.get("email"), password: formData.get("password") });
    if (error) { renderAdmin(error.message); return; }
    if (!await verifyAdmin(data.user)) {
      await state.client.auth.signOut();
      state.user = null;
      state.admin = false;
      renderAdmin("This account is not on the admin allowlist.");
      return;
    }
    await openAdminDashboard();
  }
  if (event.target.id === "roadmap-form") await saveRoadmap(event);
});

$("#admin-trigger").addEventListener("click", openAdminDialog);
$("#close-admin").addEventListener("click", () => $("#admin-dialog").close());
$("#admin-dialog").addEventListener("click", event => { if (event.target === $("#admin-dialog")) $("#admin-dialog").close(); });
$("#roadmap-search").addEventListener("input", renderRoadmaps);
$("#track-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-track]");
  if (!button) return;
  state.selectedTrack = button.dataset.track;
  $("#track-filters").querySelectorAll(".filter-button").forEach(item => item.classList.toggle("active", item === button));
  renderRoadmaps();
});
$("#room-roadmap-select").addEventListener("change", () => {
  state.roomTopicIndex = 0;
  renderInterviewTopics();
});
$("#room-topic-select").addEventListener("change", event => {
  state.roomTopicIndex = Number(event.target.value) || 0;
  renderInterviewTopics();
});
$("#generate-test").addEventListener("click", generateRoomTest);
$("#test-area").addEventListener("submit", submitGeneratedTest);
$("#test-area").addEventListener("click", event => {
  if (event.target.closest("#retake-test")) generateRoomTest();
});

async function initialize() {
  if (!hasBackendConfig && window.location.protocol !== "file:") {
    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      if (response.ok) {
        Object.assign(PREP_CONFIG, await response.json());
        hasBackendConfig = Boolean(PREP_CONFIG.supabaseUrl && PREP_CONFIG.supabaseAnonKey);
      }
    } catch (error) {
      console.info("Hosted database settings are not available; showing the sample pathways.");
    }
  }
  if (hasBackendConfig && window.supabase?.createClient) {
    state.client = window.supabase.createClient(PREP_CONFIG.supabaseUrl, PREP_CONFIG.supabaseAnonKey);
    const { data } = await state.client.auth.getSession();
    if (data.session?.user) await verifyAdmin(data.session.user);
    state.client.auth.onAuthStateChange((_event, session) => {
      if (!session) { state.user = null; state.admin = false; }
    });
  }
  await loadRoadmaps();
  renderRoadmaps();
  renderInterviewRoom();
}

initialize();
# 💻 Turing-Decidable Machine Lab

An interactive, professional-grade **Deterministic Turing Machine (DTM)** simulator designed to visualize the **decidability** of formal languages. Unlike a standard recognizer, this machine acts as a **Decider**, ensuring that for any input string $w \in \Sigma^*$, the simulation will eventually halt in either an **Accept** or **Reject** state.

## 🚀 Live Demo
**[https://dtm-sim.vercel.app/]**

---

## 🛠 Features

* **Interactive Language Library:** Choose from a set of formal language problems (Recursive Languages) including:
    * **Equal a-b Blocks:** $L = \{a^n b^n \mid n \ge 1\}$
    * **Binary Palindromes:** $L = \{w \mid w = \text{reverse}(w), w \in \{0, 1\}^*\}$
* **Animated State Transitions:** A real-time dashboard that tracks:
    * **Current State ($q_n$):** Visual feedback on the active state in the transition table.
    * **Tape Dynamics:** Watch the read/write head move and modify symbols.
    * **Complexity Metrics:** Live count of Problems, States, and Transitions.
* **Input Validation Console:** Prevents invalid symbols from entering the tape by verifying against the defined alphabet $\Sigma$ before execution.
* **Guaranteed Halting:** Built on the mathematical principle of **Turing-Decidability**, providing a definitive result for every simulation.

---

## 📖 Theoretical Background

The simulator serves as a **Universal Turing Machine (UTM)**. It takes two inputs:
1.  **The "Program":** The transition function $\delta$ of a specific language from the library.
2.  **The "Data":** The user-provided input string.

### The Decidability Guarantee
In the Theory of Computation, a language $L$ is **Turing-Decidable** (or Recursive) if there exists a Turing Machine that accepts every string $w \in L$ and rejects every string $w \notin L$. This project implements these "Deciders," avoiding the "infinite loop" scenario typical of partially decidable (Turing-Recognizable) languages.

---

## 🏗 Tech Stack

* **Frontend:** React.js + Tailwind CSS (Custom "Glassmorphism" UI)
* **Logic Engine:** Pure JavaScript implementation of a 7-tuple machine: $M = (Q, \Sigma, \Gamma, \delta, q_0, q_{accept}, q_{reject})$
* **Deployment:** Vercel (CI/CD via GitHub Actions)
* **Icons & Assets:** Lucide-React / Custom SVG animations

---

## 🚦 Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher)
* **npm** or **yarn**

### Installation & Local Setup
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Mohammed-Kamran-Ahmed/utm-sim.git](https://github.com/Mohammed-Kamran-Ahmed/utm-sim.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

---

## 🎓 Academic Acknowledgments
This project was developed as part of the **Theory of Computation** curriculum at **IIIT Sri City**. It serves as a practical exploration of the **Church-Turing Thesis** and the limits of deterministic computation.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

/**
 * quiz.js — Reusable Quiz Engine
 * Used by all 3 worlds at the end of each level
 */

// Question bank per world (5 questions each)
export const QUESTIONS = {
  1: [
    {
      q: "What is pressure?",
      options: ["How heavy something is", "Force applied over an area", "The speed of water", "How hot a fluid is"],
      answer: 1,
      fact: "Pressure = Force ÷ Area. The smaller the area, the higher the pressure for the same force!"
    },
    {
      q: "What does a hydraulic pump do?",
      options: ["It creates pressure directly", "It moves fluid to create flow", "It stops fluid from moving", "It cools down the fluid"],
      answer: 1,
      fact: "Pumps create FLOW — pressure builds up when that flow meets resistance!"
    },
    {
      q: "In a hydraulic system, what carries the pressure?",
      options: ["Electricity", "Air", "Fluid (liquid)", "Metal rods"],
      answer: 2,
      fact: "Hydraulic systems use liquid (usually oil) to carry pressure from one place to another!"
    },
    {
      q: "What happens when you push down on one side of a hydraulic system?",
      options: ["Nothing happens", "Only that side moves", "The other side also moves up", "The fluid disappears"],
      answer: 2,
      fact: "Pascal's Law: pressure applied to a fluid spreads equally in ALL directions!"
    },
    {
      q: "Yuken's vane pumps are used to...",
      options: ["Cool down machines", "Generate electricity", "Create hydraulic flow for machines", "Pump drinking water"],
      answer: 2,
      fact: "Yuken vane pumps provide steady, smooth hydraulic flow — perfect for precision machines!"
    }
  ],
  2: [
    {
      q: "What does a directional control valve do?",
      options: ["Increases pressure", "Controls WHERE fluid flows", "Filters the fluid", "Measures temperature"],
      answer: 1,
      fact: "Directional valves act like traffic lights for fluid — they decide which path the fluid takes!"
    },
    {
      q: "In Pascal's Law, pressure in a closed fluid...",
      options: ["Stays only where applied", "Decreases over distance", "Transmits equally in all directions", "Only goes upward"],
      answer: 2,
      fact: "Pascal's Law (1647): pressure applied to a confined fluid is transmitted undiminished in all directions!"
    },
    {
      q: "Which letter on a valve usually means the PRESSURE inlet?",
      options: ["A", "B", "T", "P"],
      answer: 3,
      fact: "P = Pressure (inlet), T = Tank (return), A and B = actuator ports. Standard for all hydraulic valves!"
    },
    {
      q: "Car brakes use Pascal's Law because...",
      options: ["Brakes need electricity", "Pressing pedal sends equal pressure to all 4 wheels", "Brakes are powered by air", "The steering wheel controls brakes"],
      answer: 1,
      fact: "Hydraulic brakes use Pascal's Law — one push on the pedal sends equal pressure to all 4 brake cylinders!"
    },
    {
      q: "What happens to pressure when fluid flows through a smaller pipe?",
      options: ["Pressure decreases", "Pressure stays the same", "Pressure increases", "Fluid stops flowing"],
      answer: 2,
      fact: "Smaller area = higher pressure for the same force. This is how hydraulics can lift heavy loads!"
    }
  ],
  3: [
    {
      q: "In the formula P = F ÷ A, what does 'A' stand for?",
      options: ["Acceleration", "Area", "Amount", "Angle"],
      answer: 1,
      fact: "A = Area (in m² or cm²). Pressure = Force divided by the Area it acts on!"
    },
    {
      q: "If Force = 100N and Area = 10cm², what is the Pressure?",
      options: ["1000 Pa", "10 Pa", "90 Pa", "110 Pa"],
      answer: 1,
      fact: "P = F ÷ A = 100 ÷ 10 = 10 Pa. Always divide force by area to get pressure!"
    },
    {
      q: "A hydraulic system has a small piston (area=2cm²) and large piston (area=20cm²). If you push the small one with 10N, what force does the large piston output?",
      options: ["10N", "20N", "100N", "200N"],
      answer: 2,
      fact: "Force multiplied by area ratio: 10N × (20÷2) = 100N. Hydraulics MULTIPLY force!"
    },
    {
      q: "What is the correct order of a hydraulic circuit?",
      options: [
        "Cylinder → Valve → Pump → Tank",
        "Tank → Pump → Valve → Cylinder",
        "Pump → Tank → Cylinder → Valve",
        "Valve → Pump → Tank → Cylinder"
      ],
      answer: 1,
      fact: "The flow goes: Tank (oil storage) → Pump (creates flow) → Valve (directs flow) → Cylinder (does work) → back to Tank!"
    },
    {
      q: "Blaise Pascal discovered his law in which year?",
      options: ["1347", "1547", "1647", "1847"],
      answer: 2,
      fact: "Blaise Pascal (1623–1662) published his work on fluid pressure in 1647. He was only 24 years old!"
    }
  ]
};

export class QuizEngine {
  constructor({ worldNum, onComplete }) {
    this.worldNum = worldNum;
    this.onComplete = onComplete;
    this.questions = [...QUESTIONS[worldNum]];
    this.currentIdx = 0;
    this.score = 0;
    this.maxScore = this.questions.length * 100;

    // DOM refs
    this.progressText  = document.getElementById('quiz-progress-text');
    this.progressFill  = document.getElementById('quiz-progress-fill');
    this.questionEl    = document.getElementById('quiz-question-text');
    this.optionsWrap   = document.getElementById('quiz-options-wrap');
    this.feedbackEl    = document.getElementById('quiz-feedback-text');
    this.factEl        = document.getElementById('quiz-fact-text');
    this.nextBtn       = document.getElementById('quiz-next-btn');

    this.nextBtn.addEventListener('click', () => this._next());
  }

  start() {
    this.currentIdx = 0;
    this.score = 0;
    this._render();
  }

  _render() {
    const q = this.questions[this.currentIdx];
    const total = this.questions.length;
    const num = this.currentIdx + 1;

    this.progressText.textContent = `Question ${num} of ${total}`;
    this.progressFill.style.width = `${(num / total) * 100}%`;
    this.questionEl.textContent = q.q;
    this.feedbackEl.textContent = '';
    this.factEl.style.display = 'none';
    this.factEl.textContent = '';
    this.nextBtn.style.display = 'none';

    this.optionsWrap.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this._answer(i));
      this.optionsWrap.appendChild(btn);
    });
  }

  _answer(selected) {
    const q = this.questions[this.currentIdx];
    const buttons = this.optionsWrap.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === q.answer) {
      buttons[selected].classList.add('correct');
      this.feedbackEl.textContent = '✅ Correct! +100 pts';
      this.score += 100;
    } else {
      buttons[selected].classList.add('wrong');
      buttons[q.answer].classList.add('correct');
      this.feedbackEl.textContent = '❌ Not quite! See the correct answer in green.';
    }

    this.factEl.textContent = `💡 ${q.fact}`;
    this.factEl.style.display = 'block';
    this.nextBtn.style.display = 'inline-block';
    this.nextBtn.textContent = this.currentIdx < this.questions.length - 1 ? 'Next ➡' : 'See Results 🏆';
  }

  _next() {
    this.currentIdx++;
    if (this.currentIdx < this.questions.length) {
      this._render();
    } else {
      this.onComplete(this.score, this.maxScore);
    }
  }
}

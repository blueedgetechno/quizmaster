# QuizMaster

QuizMaster is a web application that allows users to generate custom quizzes based on their prompts. Users can enter a prompt, select options (such as the number of questions, difficulty level, and topic), and QuizMaster will create a quiz for them.

Visit 💻✨: [quiz.blueedge.me](https://quiz.blueedge.me/)

## Gallery

![quiz1](https://github.com/user-attachments/assets/82df3a44-1eec-4434-98f0-6c955729d298)

![quiz15](https://github.com/user-attachments/assets/df708a97-b40e-4827-bd87-8a5a3af27b8b)

![quiz2](https://github.com/user-attachments/assets/06e5d75c-066e-4899-92b4-f035398d2d72)

## Table of Contents

1. [Features](#features)
2. [Tools Used](#tools-used)
3. [Installation](#installation)
4. [Contributing](#contributing)
5. [License](#license)

---

## Features

- **Prompt-based Quiz Generation:** Users can input any topic, and the app generates relevant quiz questions.
- **Customizable Options:** Users can set the number of questions, difficulty, and categories.
- **Real-time Results:** Users receive their scores and feedback immediately after submitting a quiz.
- **History and Stats:** Users can view previous quizzes and performance stats.

## Tools Used

- **Backend:** Next API
- **Frontend:** Next.js (v14), ui/shadcn
- **Styling:** CSS, Bootstrap (or Tailwind CSS)
- **External API:** Gemini API for prompt-based question generation, Bing Image Search API for images

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/blueedgetechno/quizmaster.git
   cd quizmaster
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Make a `.env.local` file**

   ```.env
   GEMINI_API_KEY=AIza...
   HUGGING_FACE_API_KEY=hf_...
   BING_API_KEY=8f9c...
   ```

   Gemini API Key: [aistudio.google.com](https://aistudio.google.com/app/apikey)

   Hugging Face API Key: [huggingface.co](https://huggingface.co/settings/tokens) (Optional if you intend to use gemini only)

   Bing Api Key (Optional): [Create an azure service](https://aka.ms/bingapisignup)

4. **Run:**
   ```bash
   yarn dev
   ```

## Contributing

- Fork the repository.
- Create your feature branch (git checkout -b feature/NewFeature).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature/NewFeature).
- Open a pull request.

## License

This project is licensed under the Creative Commons Zero License. See the [LICENSE](./LICENSE) file for more information.

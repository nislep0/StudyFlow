# Лабораторна робота №6

## Розгортання програмного забезпечення

### Мета роботи

Ознайомитись з принципами безперервної інтеграції (CI) та безперервного деплою (CD), а також налаштувати автоматичну перевірку коду, тестування та деплой backend і frontend частин проєкту за допомогою GitHub Actions та хмарних сервісів.

---

### CI (Continuous Integration)

Для реалізації CI було створено workflow GitHub Actions, який автоматично запускається при кожному push або pull request у гілку `main`.

У межах CI виконуються такі кроки:

1. Клонування репозиторію.
2. Встановлення Node.js 20.
3. Встановлення залежностей через `npm ci`.
4. Генерація Prisma Client для backend.
5. Перевірка форматування коду за допомогою Prettier.
6. Перевірка коду за допомогою ESLint.
7. Збірка frontend та backend частин.
8. Запуск unit-тестів.

Таким чином, кожна зміна коду автоматично перевіряється перед злиттям у основну гілку.

---

### CD (Continuous Deployment)

#### Backend (Render)

Для деплою backend було використано Render Deploy Hook. У GitHub створено секрет `RENDER_DEPLOY_HOOK`, який містить URL деплой-хука Render.

Після успішного проходження CI workflow автоматично викликає цей hook, що запускає деплой backend сервісу.

Workflow CD для backend:

```yaml
name: CD
on:
  push: { branches: [main] }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsSL -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

#### Frontend (Vercel)

Frontend частина була задеплоєна на Vercel. Для неї окремий CD workflow не створювався, оскільки Vercel має вбудовану інтеграцію з GitHub.

Кожен push у гілку `main` автоматично викликає збірку та деплой frontend.

---

### Змінні середовища

Для коректної роботи застосунку були налаштовані environment variables:

- Backend (Render): `DATABASE_URL`
- Frontend (Vercel): `VITE_API_BASE`

Також для CI/CD використовуються GitHub Secrets.

---

### Перевірка роботи

Frontend після деплою коректно взаємодіє з backend API.
URL для перевірки: https://study-flow-frontend-five.vercel.app/

---

### Висновок

У ході виконання лабораторної роботи було налаштовано повноцінний CI/CD процес для проєкту. CI забезпечує автоматичну перевірку якості коду та тестування, а CD - автоматичний деплой backend на Render та frontend на Vercel. Отримані навички дозволяють автоматизувати процес розробки та зменшити кількість помилок при розгортанні застосунків.

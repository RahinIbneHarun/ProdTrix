export type CarouselItem = { name: string; image: string };

export type ProfileData = {
  name: string;
  field: string;
  email: string;
  status: string;
  bio: string;
  coverPhoto: string;
  avatarPhoto: string;
  courseItems: CarouselItem[];
  bookItems: CarouselItem[];
  ideaItems: CarouselItem[];
};

// In-memory mock store — resets on server restart / cold start.
// Swap this out for a real DB (or wire into your Zustand persistence
// layer) when you're ready; the API routes below only touch this object.
export const mockProfile: ProfileData = {
  name: "Sifur Taher Sarar",
  field: "Full Stack Developer",
  email: "sifur@example.com",
  status: "Available for work",
  bio: "Building clean, scalable systems — one commit at a time.",
  coverPhoto: "https://picsum.photos/seed/prodtrix-cover/1200/400",
  avatarPhoto: "https://picsum.photos/seed/prodtrix-avatar/200/200",
  courseItems: [
    { name: "C++", image: "https://picsum.photos/seed/course-cpp/300/300" },
    { name: "C#", image: "https://picsum.photos/seed/course-csharp/300/300" },
    {
      name: "AI Fundamentals",
      image: "https://picsum.photos/seed/course-ai/300/300",
    },
  ],
  bookItems: [
    {
      name: "Clean Code",
      image: "https://picsum.photos/seed/book-cleancode/300/300",
    },
    {
      name: "The Pragmatic Programmer",
      image: "https://picsum.photos/seed/book-pragmatic/300/300",
    },
  ],
  ideaItems: [
    {
      name: "Build a SaaS",
      image: "https://picsum.photos/seed/idea-saas/300/300",
    },
    {
      name: "Open source CLI tool",
      image: "https://picsum.photos/seed/idea-cli/300/300",
    },
  ],
};

import Login from '@/pages/login';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/card-generation')({
  component: Login,
});

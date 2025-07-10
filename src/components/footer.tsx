export function Footer() {
  return (
    <footer className="bg-background mt-12 py-6 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Binary Bakery Navigator. All rights reserved.</p>
      </div>
    </footer>
  );
}

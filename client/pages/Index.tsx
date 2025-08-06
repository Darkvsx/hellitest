import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceFilter } from "@/components/ServiceFilter";
import {
  ShoppingCart,
  User,
  LogIn,
  Menu,
  X,
  Star,
  Shield,
  Clock,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Play,
  Users,
  Award,
  Gamepad2,
  MessageSquare,
  ArrowUp,
  Filter,
} from "lucide-react";

type ServiceCategory = 'All' | 'Level Boost' | 'Medals' | 'Samples' | 'Super Credits' | 'Promotions';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const { services } = useServices();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Filter services by category and active status
  const activeServices = services.filter((service) => service.active);
  const filteredServices = selectedCategory === 'All'
    ? activeServices
    : activeServices.filter(service => service.category === selectedCategory);

  // Calculate service counts by category
  const serviceCounts = activeServices.reduce((counts, service) => {
    counts[service.category] = (counts[service.category] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const handleAddToCart = (service: any) => {
    addToCart(service);
    toast({
      title: "Added to cart!",
      description: `${service.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F140080265ae84fed81345db6d679ba75%2F0ba66a9961654e799d47f40a907b95dc?format=webp&width=64"
                  alt="HelldiversBoost Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  HELLDIVERS II
                </span>
                <div className="text-sm text-primary font-semibold">
                  BOOSTING
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="#services"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="/bundles"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Bundles
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </Link>
              <Link
                to="/faq"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                FAQ
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-primary/10"
                  >
                    <Link to={isAdmin ? "/admin" : "/account"}>
                      <User className="w-4 h-4 mr-2" />
                      {isAdmin ? "Admin" : "Account"}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-primary/10"
                    asChild
                  >
                    <Link to="/cart">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.username}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={logout}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-primary/10"
                    asChild
                  >
                    <Link to="/cart">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
                    asChild
                  >
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-primary/10"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="#services"
                className="block py-2 text-muted-foreground hover:text-primary"
              >
                Services
              </Link>
              <Link
                to="/bundles"
                className="block py-2 text-muted-foreground hover:text-primary"
              >
                Bundles
              </Link>
              <Link
                to="/about"
                className="block py-2 text-muted-foreground hover:text-primary"
              >
                About
              </Link>
              <Link
                to="/faq"
                className="block py-2 text-muted-foreground hover:text-primary"
              >
                FAQ
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to={isAdmin ? "/admin" : "/account"}>
                        <User className="w-4 h-4 mr-2" />
                        {isAdmin ? "Admin" : "Account"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 relative"
                      asChild
                    >
                      <Link to="/cart">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart
                        {cartItemCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  </div>
                  <div className="pt-2 text-center text-sm text-muted-foreground">
                    Welcome, {user?.username}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 relative"
                      asChild
                    >
                      <Link to="/cart">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart
                        {cartItemCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary to-blue-600"
                    asChild
                  >
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Professional Helldivers 2 Boosting Service
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                HELLDIVERS II
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BOOSTING
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Boosting service with{" "}
              <span className="text-primary font-semibold">fast delivery</span>,
              <span className="text-primary font-semibold">
                {" "}
                secure methods
              </span>
              , and
              <span className="text-primary font-semibold">
                {" "}
                competitive pricing
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Your Order
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/10 group"
                asChild
              >
                <a
                  href="https://discord.gg/helldivers2boost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join Discord Community
                </a>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Fast Delivery
              </h3>
              <p className="text-muted-foreground">
                Orders completed efficiently within minutes and fast results
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                100% Secure
              </h3>
              <p className="text-muted-foreground">
                Your account safety is our top priority
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Elite Service
              </h3>
              <p className="text-muted-foreground">
                Experienced team with consistent results
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-24 bg-gradient-to-br from-muted/30 to-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Boost Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Helldivers Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive selection of professional boosting
              services
            </p>
          </div>

          {/* Service Filter */}
          {activeServices.length > 0 && (
            <div className="mb-12">
              <ServiceFilter
                onFilterChange={setSelectedCategory}
                activeFilter={selectedCategory}
                serviceCounts={serviceCounts}
              />
            </div>
          )}

          {activeServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Services Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                We're currently setting up our amazing boosting services. Check
                back soon for incredible Helldivers 2 options!
              </p>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 hover:bg-primary/10"
                asChild
              >
                <Link to="/admin">
                  <User className="w-5 h-5 mr-2" />
                  Admin Panel
                </Link>
              </Button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Filter className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-6">No Services Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                No services available in the "{selectedCategory}" category. Try selecting a different category.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSelectedCategory('All')}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Target className="w-5 h-5 mr-2" />
                View All Services
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs bg-background/50">
                        {service.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center gap-3 pt-3">
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        ${service.price}
                      </span>
                      {service.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${service.originalPrice}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium text-primary">
                          {service.duration}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Difficulty:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {service.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center"
                            >
                              <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg group-hover:shadow-xl transition-all"
                        onClick={() => handleAddToCart(service)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                1,247+
              </div>
              <p className="text-muted-foreground font-medium">
                Happy Customers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-muted-foreground font-medium">
                Support Available
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <p className="text-muted-foreground font-medium">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                2-4h
              </div>
              <p className="text-muted-foreground font-medium">
                Average Delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    HELLDIVERS II
                  </span>
                  <div className="text-xs text-primary font-semibold">
                    BOOSTING
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Professional Helldivers 2 boosting services for elite helldivers
                seeking excellence.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Level Boosting
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Planet Liberation
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Difficulty Unlock
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary transition-colors">
                    Item Farming
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="https://discord.gg/helldivers2boost"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Discord Community
                  </a>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-primary transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to={isAdmin ? "/admin" : "/account"}
                    className="hover:text-primary transition-colors"
                  >
                    {isAdmin ? "Admin Panel" : "My Account"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Helldivers II Boosting. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <Button
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-600 shadow-lg transition-all duration-300 ${
          scrolled ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  );
}

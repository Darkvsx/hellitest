import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, LogIn, Menu, X, Star, Shield, Clock, Trophy, Target, Zap } from "lucide-react";

interface BoostingService {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  difficulty: string;
  features: string[];
  popular?: boolean;
}

const boostingServices: BoostingService[] = [
  {
    id: "level-boost",
    title: "Level Boost",
    description: "Power level your character to maximum efficiency",
    price: 29.99,
    originalPrice: 39.99,
    duration: "1-3 days",
    difficulty: "All Levels",
    features: ["Level 1-50", "All Equipment Unlocked", "Full Completion", "24/7 Progress Updates"],
    popular: true
  },
  {
    id: "planet-liberation",
    title: "Planet Liberation",
    description: "Complete planet liberation campaigns with expert helldivers",
    price: 49.99,
    duration: "3-7 days",
    difficulty: "Extreme",
    features: ["Full Planet Clear", "All Objectives", "Maximum Rewards", "Screenshot Proof"]
  },
  {
    id: "difficulty-unlock",
    title: "Difficulty Unlock",
    description: "Unlock all difficulty levels including Helldive operations",
    price: 19.99,
    duration: "1-2 days",
    difficulty: "Progressive",
    features: ["All Difficulties", "Suicide Mission Access", "Achievement Completion", "Safe & Secure"]
  },
  {
    id: "super-samples",
    title: "Super Sample Farming",
    description: "Collect rare super samples for weapon and stratagem upgrades",
    price: 34.99,
    duration: "2-4 days",
    difficulty: "High",
    features: ["50+ Super Samples", "Weapon Upgrades", "Stratagem Access", "Priority Service"]
  },
  {
    id: "medals-credits",
    title: "Medals & Credits",
    description: "Farm medals and super credits for warbond progression",
    price: 24.99,
    duration: "1-3 days",
    difficulty: "Medium",
    features: ["1000+ Medals", "500+ Super Credits", "Warbond Progress", "Fast Delivery"]
  },
  {
    id: "galactic-war",
    title: "Galactic War Progress",
    description: "Complete galactic war objectives and major orders",
    price: 39.99,
    duration: "5-10 days",
    difficulty: "Extreme",
    features: ["Major Order Completion", "Strategic Impact", "Community Contribution", "Elite Performance"]
  }
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const addToCart = (serviceId: string) => {
    setCartItems(prev => [...prev, serviceId]);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HelldiversBoost</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-4 py-2 space-y-2">
              <a href="#services" className="block py-2 text-muted-foreground hover:text-foreground">Services</a>
              <a href="#about" className="block py-2 text-muted-foreground hover:text-foreground">About</a>
              <a href="#contact" className="block py-2 text-muted-foreground hover:text-foreground">Contact</a>
              <div className="flex space-x-2 pt-2">
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to="/admin">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 relative" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs">
                        {cartItems.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
              <Button size="sm" className="w-full" asChild>
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Professional Helldivers 2 Boosting Service
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Elite Helldivers 2
            <span className="block text-primary">Boosting Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional boosting services for Helldivers 2. Complete missions, unlock content, and dominate the galactic war with our expert helldivers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Trophy className="w-5 h-5 mr-2" />
              View Services
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Shield className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick turnaround times with 24/7 progress updates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">100% Safe</h3>
              <p className="text-muted-foreground">Secure account handling with professional players</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Expert Players</h3>
              <p className="text-muted-foreground">Elite helldivers with proven track records</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Boosting Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive selection of Helldivers 2 boosting services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boostingServices.map((service) => (
              <Card key={service.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-2xl font-bold text-primary">
                      ${service.price}
                    </span>
                    {service.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${service.originalPrice}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium">{service.difficulty}</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">What's Included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(service.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">HelldiversBoost</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional Helldivers 2 boosting services for elite helldivers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Level Boosting</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Planet Liberation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Difficulty Unlock</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Item Farming</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Login</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">My Orders</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Admin Panel</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 HelldiversBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

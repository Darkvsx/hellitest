import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  User,
  Mail,
  MessageSquare,
  ArrowLeft,
  Lock,
  PaypalIcon as Paypal,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: ''
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Redirect to login if not authenticated and no guest info
  if (!isAuthenticated && (!guestInfo.name || !guestInfo.email)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Your Order</CardTitle>
              <CardDescription>
                Please sign in or provide your information to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Existing Customer?</h3>
                  <Link to="/login">
                    <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                      <User className="w-4 h-4 mr-2" />
                      Sign In to Your Account
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue as guest</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email Address *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    We'll use this email to send you order updates and tracking information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handlePayPalPayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create the order
      const orderId = addOrder({
        userId: user?.id || 'guest',
        customerEmail: user?.email || guestInfo.email,
        customerName: user?.username || guestInfo.name,
        services: cartItems.map(item => ({
          id: item.service.id,
          name: item.service.title,
          price: item.service.price,
          quantity: item.quantity
        })),
        status: 'pending',
        totalAmount: total,
        paymentStatus: 'paid',
        notes: orderNotes
      });

      // Clear cart
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been confirmed. You'll receive an email confirmation shortly.`,
      });

      // Redirect to order tracking
      navigate(`/order/${orderId}`);

    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some services to your cart before proceeding to checkout
            </p>
            <Link to="/">
              <Button>Browse Services</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-card to-card/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Secure
              </span>
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                {" "}Checkout
              </span>
            </h1>
            <p className="text-muted-foreground">
              Complete your order securely with PayPal
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.service.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} • {item.service.duration}
                        </p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.service.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.service.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.service.price} each</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user?.username || guestInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email || guestInfo.email}</p>
                  </div>
                  {!isAuthenticated && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        <Mail className="w-4 h-4 inline mr-1" />
                        We'll send order updates to this email address
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Secure payment processing via PayPal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* PayPal Payment */}
                  <div className="p-6 border-2 border-primary/20 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5">
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">PayPal</div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      Pay securely with your PayPal account or credit card
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>256-bit SSL encryption</span>
                      <span>•</span>
                      <span>Buyer protection</span>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Any special requests or preferred playing times..."
                      rows={3}
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand that my account information will be handled securely.
                    </label>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayPalPayment}
                    disabled={!agreeToTerms || isProcessing}
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Pay ${total.toFixed(2)} with PayPal
                      </>
                    )}
                  </Button>

                  {/* Security Features */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      Your Security is Guaranteed
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        SSL encrypted payment processing
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        No account details stored
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        100% account safety guarantee
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        24/7 customer support
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Timeline */}
            <Card className="border border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Instant Confirmation</p>
                      <p className="text-sm text-muted-foreground">You'll receive an email confirmation immediately</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Booster Assignment</p>
                      <p className="text-sm text-muted-foreground">Our team will assign an expert booster within 1 hour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Boosting Begins</p>
                      <p className="text-sm text-muted-foreground">Track progress in real-time through your account</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Completion & Handover</p>
                      <p className="text-sm text-muted-foreground">Your account is returned with all objectives completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

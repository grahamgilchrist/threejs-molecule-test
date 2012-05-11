# Require any additional compass plugins here.
def is_linux?
  RUBY_PLATFORM.downcase.include?('linux')
end

def is_mac?
  RUBY_PLATFORM.downcase.include?('darwin')
end

if is_mac?
  begin
    require 'compass-growl'
  rescue LoadError
    puts "compass-growl missing: `gem install compass-growl`"
  end
end

if is_linux?
  # This might throw a fit because of the icon paths... can't test that so easily though.
  # At the time of writing (2011-11-16) the paths existed on Charlie's machine.
  # Taken from https://gist.github.com/1195687
  begin
    require 'libnotify'

    # success callback
    on_stylesheet_saved do |filename|
      #Libnotify.show :summary => "#{File.basename(filename)}", :body => "Updated", :icon_path => "/usr/share/icons/gnome/256x256/actions/view-refresh.png"
    end

    # error callback
    on_stylesheet_error do |filename, message|
      Libnotify.show :summary => "#{File.basename(filename)}", :body => "#{message}", :icon_path => "/usr/share/icons/gnome/256x256/actions/edit-delete.png"
    end
  rescue LoadError
    puts 'libnotify missing: `sudo apt-get install libnotify && sudo gem install libnotify`'
  end
end

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "styles"
sass_dir = "sass"
images_dir = "images"
javascripts_dir = "scripts"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
